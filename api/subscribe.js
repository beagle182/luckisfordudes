/**
 * Vercel serverless function — adds an email to your Mailchimp audience.
 *
 * Secrets (Vercel → Settings → Environment Variables):
 *   MAILCHIMP_API_KEY
 *   MAILCHIMP_AUDIENCE_ID
 * Optional:
 *   MAILCHIMP_SERVER_PREFIX  (auto from API key if omitted)
 *   MAILCHIMP_DOUBLE_OPT_IN  ("true" default, or "false")
 */

function getServerPrefix(apiKey, override) {
  if (override && String(override).trim()) {
    return String(override).trim();
  }
  const parts = String(apiKey || "").split("-");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function readJsonBody(req) {
  if (req.body != null) {
    if (typeof req.body === "string") {
      if (!req.body.trim()) return {};
      return JSON.parse(req.body);
    }
    if (typeof req.body === "object") {
      return req.body;
    }
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  return JSON.parse(raw);
}

module.exports = async function handler(req, res) {
  try {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");

    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.end();
      return;
    }

    if (req.method !== "POST") {
      res.statusCode = 405;
      res.end(JSON.stringify({ ok: false, error: "Method not allowed. Use POST." }));
      return;
    }

    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    const server = getServerPrefix(apiKey, process.env.MAILCHIMP_SERVER_PREFIX);
    const doubleOptIn =
      String(process.env.MAILCHIMP_DOUBLE_OPT_IN || "true").toLowerCase() !==
      "false";

    if (!apiKey || !audienceId || !server) {
      console.error("Mailchimp env missing", {
        hasKey: !!apiKey,
        hasAudience: !!audienceId,
        server: server || null,
      });
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          ok: false,
          error: "Mailing list is not configured yet. Please try again later.",
        })
      );
      return;
    }

    let body;
    try {
      body = await readJsonBody(req);
    } catch (err) {
      console.error("Body parse error", err);
      res.statusCode = 400;
      res.end(JSON.stringify({ ok: false, error: "Invalid request body." }));
      return;
    }

    // Honeypot — bots fill hidden fields
    if (body.website || body.company) {
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          ok: true,
          message: "Thanks — check your inbox to confirm.",
        })
      );
      return;
    }

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    if (!email || !isValidEmail(email)) {
      res.statusCode = 400;
      res.end(
        JSON.stringify({
          ok: false,
          error: "Please enter a valid email address.",
        })
      );
      return;
    }

    const url = `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members`;
    const auth = Buffer.from(`luckisfordudes:${apiKey}`).toString("base64");

    const mcRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: doubleOptIn ? "pending" : "subscribed",
      }),
    });

    const mcData = await mcRes.json().catch(() => ({}));

    if (mcRes.status === 400 && mcData.title === "Member Exists") {
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          ok: true,
          message:
            "You’re already on the list — we’ll be in touch when we launch.",
        })
      );
      return;
    }

    if (
      mcRes.status === 400 &&
      /forgotten|compliance/i.test(String(mcData.detail || ""))
    ) {
      res.statusCode = 400;
      res.end(
        JSON.stringify({
          ok: false,
          error:
            "This address can’t be re-added automatically. Email us and we’ll sort it.",
        })
      );
      return;
    }

    if (!mcRes.ok) {
      console.error("Mailchimp error", mcRes.status, mcData);
      res.statusCode = 502;
      res.end(
        JSON.stringify({
          ok: false,
          error:
            "Something went wrong adding you to the list. Please try again.",
        })
      );
      return;
    }

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        ok: true,
        message: doubleOptIn
          ? "Almost there — check your inbox and confirm your email to join the list."
          : "You’re on the list — thanks! We’ll shout when we launch.",
      })
    );
  } catch (err) {
    console.error("Unhandled subscribe error", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        ok: false,
        error: "Unexpected server error. Please try again.",
      })
    );
  }
};
