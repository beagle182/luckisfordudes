/**
 * Vercel serverless function — adds an email to your Mailchimp audience.
 *
 * Secrets (set in Vercel → Project → Settings → Environment Variables):
 *   MAILCHIMP_API_KEY   (from Mailchimp → Account → API keys)
 *   MAILCHIMP_AUDIENCE_ID   (from Audience → Settings)
 *
 * Optional:
 *   MAILCHIMP_SERVER_PREFIX   (e.g. us1 — auto-detected from API key if omitted)
 *   MAILCHIMP_DOUBLE_OPT_IN   "true" (default) or "false"
 */

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function getServerPrefix(apiKey, override) {
  if (override && String(override).trim()) {
    return String(override).trim();
  }
  const parts = String(apiKey || "").split("-");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

function isValidEmail(email) {
  // Practical check — Mailchimp will validate fully
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async function handler(req, res) {
  // CORS: same site only needs this if you ever call from another domain
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "Method not allowed. Use POST." });
    return;
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const server =
    getServerPrefix(apiKey, process.env.MAILCHIMP_SERVER_PREFIX) || "";
  const doubleOptIn =
    String(process.env.MAILCHIMP_DOUBLE_OPT_IN || "true").toLowerCase() !==
    "false";

  if (!apiKey || !audienceId || !server) {
    console.error("Mailchimp env vars missing or incomplete");
    json(res, 500, {
      ok: false,
      error:
        "Mailing list is not configured yet. Please try again later.",
    });
    return;
  }

  let body = {};
  try {
    if (typeof req.body === "string") {
      body = JSON.parse(req.body || "{}");
    } else if (req.body && typeof req.body === "object") {
      body = req.body;
    } else {
      // Some runtimes leave the body on the request stream; Vercel usually parses JSON
      body = {};
    }
  } catch {
    json(res, 400, { ok: false, error: "Invalid request body." });
    return;
  }

  // Honeypot — bots fill hidden fields; real users leave this empty
  if (body.website || body.company) {
    json(res, 200, { ok: true, message: "Thanks — check your inbox to confirm." });
    return;
  }

  const email = String(body.email || "")
    .trim()
    .toLowerCase();

  if (!email || !isValidEmail(email)) {
    json(res, 400, { ok: false, error: "Please enter a valid email address." });
    return;
  }

  const url = `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members`;
  const auth = Buffer.from(`luckisfordudes:${apiKey}`).toString("base64");

  const payload = {
    email_address: email,
    // "pending" = double opt-in (recommended for UK). "subscribed" = single opt-in.
    status: doubleOptIn ? "pending" : "subscribed",
  };

  let mcRes;
  let mcData = {};
  try {
    mcRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    mcData = await mcRes.json().catch(() => ({}));
  } catch (err) {
    console.error("Mailchimp request failed", err);
    json(res, 502, {
      ok: false,
      error: "Could not reach the mailing list service. Please try again.",
    });
    return;
  }

  // Already on the list (or was previously)
  if (mcRes.status === 400 && mcData.title === "Member Exists") {
    json(res, 200, {
      ok: true,
      message:
        "You’re already on the list — we’ll be in touch when we launch.",
    });
    return;
  }

  // Previously unsubscribed — try re-subscribe via PATCH
  if (mcRes.status === 400 && /forgotten|compliance/i.test(String(mcData.detail || ""))) {
    json(res, 400, {
      ok: false,
      error:
        "This address can’t be re-added automatically. Email us and we’ll sort it.",
    });
    return;
  }

  if (!mcRes.ok) {
    console.error("Mailchimp error", mcRes.status, mcData);
    json(res, 502, {
      ok: false,
      error: "Something went wrong adding you to the list. Please try again.",
    });
    return;
  }

  json(res, 200, {
    ok: true,
    message: doubleOptIn
      ? "Almost there — check your inbox and confirm your email to join the list."
      : "You’re on the list — thanks! We’ll shout when we launch.",
  });
};
