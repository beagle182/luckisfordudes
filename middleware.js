/**
 * Password-protect the temporary full-shop preview paths.
 * Public homepage (/) and mailing list stay open.
 *
 * Env: PREVIEW_PASSWORD  (set in Vercel → Environment Variables)
 */

import { next } from "@vercel/edge";

const PROTECTED_PREFIXES = ["/devtemptobedeleted", "/inches"];
const COOKIE_NAME = "lifd_preview";

function isProtectedPath(pathname) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(String(text));
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(function (b) {
      return b.toString(16).padStart(2, "0");
    })
    .join("");
}

function getCookie(request, name) {
  const header = request.headers.get("cookie") || "";
  const parts = header.split(";");
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    if (key === name) {
      return decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return "";
}

function loginPage(returnTo, errorMessage) {
  const err = errorMessage
    ? '<p class="err" role="alert">' + errorMessage + "</p>"
    : "";
  const safeReturn = String(returnTo || "/devtemptobedeleted").replace(
    /"/g,
    "&quot;"
  );

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Preview login | Luck Is For Dudes</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Nunito:wght@400;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh; display: grid; place-items: center;
      font-family: Nunito, system-ui, sans-serif;
      background: linear-gradient(145deg, #FF9F1C 0%, #FFC14D 40%, #FF7A00 100%);
      color: #111; padding: 1.25rem;
    }
    .card {
      width: min(100%, 400px); background: #fffdf5;
      border: 4px solid #111; border-radius: 16px;
      box-shadow: 8px 8px 0 #111; padding: 1.5rem 1.35rem 1.35rem;
    }
    h1 {
      margin: 0 0 0.35rem; font-family: Bangers, system-ui, sans-serif;
      font-size: 2rem; letter-spacing: 0.03em; font-weight: 400;
    }
    p { margin: 0 0 1rem; font-weight: 700; color: #2b2b2b; line-height: 1.45; }
    label { display: block; font-weight: 800; margin-bottom: 0.35rem; }
    input[type="password"] {
      width: 100%; padding: 0.8rem 0.9rem; font: inherit; font-weight: 700;
      border: 3px solid #111; border-radius: 10px; margin-bottom: 0.9rem;
      box-shadow: 2px 2px 0 #111;
    }
    button {
      width: 100%; padding: 0.85rem 1rem; font: inherit; font-weight: 800;
      color: #fff; background: #E63946; border: 3px solid #111;
      border-radius: 999px; box-shadow: 4px 4px 0 #111; cursor: pointer;
    }
    button:hover { transform: translate(-1px, -1px); box-shadow: 5px 5px 0 #111; }
    .err {
      background: #ffcdd2; border: 3px solid #111; border-radius: 10px;
      padding: 0.65rem 0.8rem; font-weight: 800; margin-bottom: 0.85rem;
    }
    .note { margin-top: 0.85rem; font-size: 0.9rem; color: #5c5c5c; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Dev preview</h1>
    <p>Password required. This is not the public site.</p>
    ${err}
    <form method="post" action="/api/preview-login">
      <input type="hidden" name="returnTo" value="${safeReturn}">
      <label for="password">Password</label>
      <input id="password" name="password" type="password" autocomplete="current-password" required autofocus>
      <button type="submit">Unlock preview</button>
    </form>
    <p class="note">Public homepage stays at luckisfordudes.com (Coming Soon).</p>
  </div>
</body>
</html>`;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const { pathname } = url;

  if (!isProtectedPath(pathname)) {
    return next();
  }

  const password = process.env.PREVIEW_PASSWORD;
  if (!password) {
    return new Response(
      loginPage(
        pathname,
        "Preview password is not configured yet (PREVIEW_PASSWORD)."
      ),
      {
        status: 503,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
        },
      }
    );
  }

  const expected = await sha256Hex(password);
  const cookie = getCookie(request, COOKIE_NAME);

  if (cookie && cookie === expected) {
    return next();
  }

  return new Response(loginPage(pathname + url.search), {
    status: 401,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export const config = {
  matcher: ["/devtemptobedeleted", "/devtemptobedeleted/:path*", "/inches", "/inches/:path*"],
};
