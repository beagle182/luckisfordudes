/**
 * Vercel serverless function — emails contact-form messages via Resend.
 *
 * Secrets (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY          (required)
 *   CONTACT_TO_EMAIL        (who receives messages — default below)
 * Optional:
 *   CONTACT_FROM_EMAIL      (must be a Resend-verified sender / domain)
 *                           e.g. "Luck Is For Dudes <hello@luckisfordudes.com>"
 *                           Until your domain is verified, use Resend's test sender:
 *                           "Luck Is For Dudes <onboarding@resend.com>"
 *                           (test sender can only email your Resend account address)
 */

const DEFAULT_TO = "admindudes@luckisfordudes.com";
const DEFAULT_FROM = "Luck Is For Dudes <onboarding@resend.com>";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clamp(text, max) {
  const s = String(text || "").trim();
  if (s.length <= max) return s;
  return s.slice(0, max);
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

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = String(process.env.CONTACT_TO_EMAIL || DEFAULT_TO).trim();
    const fromEmail = String(process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM).trim();

    if (!apiKey) {
      console.error("Contact form: RESEND_API_KEY missing");
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          ok: false,
          error: "Contact form is not configured yet. Please email us directly.",
        })
      );
      return;
    }

    if (!toEmail || !isValidEmail(toEmail)) {
      console.error("Contact form: CONTACT_TO_EMAIL invalid", toEmail);
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          ok: false,
          error: "Contact form is not configured yet. Please email us directly.",
        })
      );
      return;
    }

    let body;
    try {
      body = await readJsonBody(req);
    } catch (err) {
      console.error("Contact form: body parse error", err);
      res.statusCode = 400;
      res.end(JSON.stringify({ ok: false, error: "Invalid request body." }));
      return;
    }

    // Honeypot — bots fill hidden fields; pretend success
    if (body.website || body.company) {
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          ok: true,
          message: "Thanks — we’ve got your message and will reply soon.",
        })
      );
      return;
    }

    const name = clamp(body.name, 120);
    const email = clamp(body.email, 200).toLowerCase();
    const subject = clamp(body.subject, 200) || "Website enquiry";
    const message = clamp(body.message, 5000);

    if (!name || !email || !message) {
      res.statusCode = 400;
      res.end(
        JSON.stringify({
          ok: false,
          error: "Please fill in your name, email and message.",
        })
      );
      return;
    }

    if (!isValidEmail(email)) {
      res.statusCode = 400;
      res.end(
        JSON.stringify({
          ok: false,
          error: "Please enter a valid email address.",
        })
      );
      return;
    }

    const textBody = [
      "New message from the Luck Is For Dudes website contact form.",
      "",
      "Name: " + name,
      "Email: " + email,
      "Subject: " + subject,
      "",
      "Message:",
      message,
      "",
      "—",
      "Reply directly to this email to answer " + name + ".",
    ].join("\n");

    const htmlBody = [
      "<p><strong>New message from the Luck Is For Dudes website contact form.</strong></p>",
      "<p><strong>Name:</strong> " + escapeHtml(name) + "<br>",
      "<strong>Email:</strong> " + escapeHtml(email) + "<br>",
      "<strong>Subject:</strong> " + escapeHtml(subject) + "</p>",
      "<p><strong>Message:</strong></p>",
      "<p>" + escapeHtml(message).replace(/\n/g, "<br>") + "</p>",
      "<hr>",
      "<p style=\"color:#666;font-size:13px\">Reply directly to this email to answer " +
        escapeHtml(name) +
        ".</p>",
    ].join("");

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: "[Website] " + subject,
        text: textBody,
        html: htmlBody,
      }),
    });

    const resendData = await resendRes.json().catch(() => ({}));

    if (!resendRes.ok) {
      console.error("Resend error", resendRes.status, resendData);
      res.statusCode = 502;
      res.end(
        JSON.stringify({
          ok: false,
          error:
            "Could not send your message right now. Please try again or email us directly.",
        })
      );
      return;
    }

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        ok: true,
        message:
          "Thanks, " +
          name +
          "! Your message is on its way — we usually reply within 1–2 working days.",
      })
    );
  } catch (err) {
    console.error("Unhandled contact error", err);
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
