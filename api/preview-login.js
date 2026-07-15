/**
 * Sets a short-lived preview cookie after a correct password.
 * Used by the password form on protected preview routes.
 *
 * Env: PREVIEW_PASSWORD
 */

const COOKIE_NAME = "lifd_preview";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function sha256HexNode(text) {
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(String(text), "utf8").digest("hex");
}

function isSafeReturnTo(value) {
  if (!value || typeof value !== "string") return false;
  // Only same-site relative paths we protect
  return (
    value.startsWith("/devtemptobedeleted") || value.startsWith("/inches")
  );
}

function parseBody(req) {
  return new Promise(function (resolve, reject) {
    if (req.body != null) {
      if (typeof req.body === "string") {
        resolve(req.body);
        return;
      }
      if (typeof req.body === "object") {
        resolve(req.body);
        return;
      }
    }
    const chunks = [];
    req.on("data", function (c) {
      chunks.push(c);
    });
    req.on("end", function () {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    req.on("error", reject);
  });
}

function parseForm(raw) {
  if (raw && typeof raw === "object" && !Buffer.isBuffer(raw)) {
    return raw;
  }
  const text = String(raw || "");
  const out = {};
  // application/x-www-form-urlencoded
  text.split("&").forEach(function (pair) {
    if (!pair) return;
    const i = pair.indexOf("=");
    const k = decodeURIComponent((i === -1 ? pair : pair.slice(0, i)).replace(/\+/g, " "));
    const v = decodeURIComponent((i === -1 ? "" : pair.slice(i + 1)).replace(/\+/g, " "));
    out[k] = v;
  });
  return out;
}

function redirect(res, location, cookieValue) {
  const secure =
    process.env.VERCEL || process.env.NODE_ENV === "production"
      ? "; Secure"
      : "";
  res.statusCode = 303;
  res.setHeader(
    "Set-Cookie",
    COOKIE_NAME +
      "=" +
      encodeURIComponent(cookieValue) +
      "; Path=/; HttpOnly; SameSite=Lax; Max-Age=" +
      MAX_AGE_SECONDS +
      secure
  );
  res.setHeader("Location", location);
  res.setHeader("Cache-Control", "no-store");
  res.end();
}

function htmlError(res, status, message, returnTo) {
  const safeReturn = isSafeReturnTo(returnTo)
    ? returnTo
    : "/devtemptobedeleted";
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(`<!DOCTYPE html>
<html lang="en-GB"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Preview login</title>
<style>
body{font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#FF9F1C}
.card{background:#fff;border:4px solid #111;border-radius:14px;padding:1.25rem;max-width:22rem;box-shadow:6px 6px 0 #111}
a,button{font-weight:800}
.err{color:#C1121F;font-weight:800}
</style>
</head><body><div class="card">
<p class="err">${message}</p>
<p><a href="${safeReturn}">Try again</a></p>
</div></body></html>`);
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.statusCode = 405;
      res.setHeader("Allow", "POST");
      res.end("Method not allowed");
      return;
    }

    const passwordEnv = process.env.PREVIEW_PASSWORD;
    if (!passwordEnv) {
      htmlError(res, 503, "Preview password is not configured on the server.", "/devtemptobedeleted");
      return;
    }

    const raw = await parseBody(req);
    const body = parseForm(raw);
    const password = String(body.password || "").trim();
    const returnTo = isSafeReturnTo(body.returnTo)
      ? body.returnTo
      : "/devtemptobedeleted";

    if (!password || password !== passwordEnv) {
      // Soft delay against brute force (basic)
      await new Promise(function (r) {
        setTimeout(r, 400);
      });
      htmlError(res, 401, "Wrong password. Try again.", returnTo);
      return;
    }

    const token = sha256HexNode(passwordEnv);
    redirect(res, returnTo, token);
  } catch (err) {
    console.error("preview-login error", err);
    htmlError(res, 500, "Something went wrong. Please try again.", "/devtemptobedeleted");
  }
};
