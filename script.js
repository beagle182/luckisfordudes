/**
 * Luck Is For Dudes — small bits of interactivity
 * You usually only need to edit the thank-you message below.
 */

(function () {
  "use strict";

  // ----- Year in footer -----
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // ----- Mobile navigation -----
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close menu after clicking a link (handy on phones)
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  // ----- Contact form (demo only — does not send email) -----
  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");

  if (form && statusEl) {
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // stop the page from refreshing

      var name = form.elements.namedItem("name");
      var email = form.elements.namedItem("email");
      var message = form.elements.namedItem("message");

      var nameVal = name && "value" in name ? String(name.value).trim() : "";
      var emailVal = email && "value" in email ? String(email.value).trim() : "";
      var messageVal = message && "value" in message ? String(message.value).trim() : "";

      if (!nameVal || !emailVal || !messageVal) {
        statusEl.hidden = false;
        statusEl.classList.add("is-error");
        // CHANGE THIS: error message if fields are empty
        statusEl.textContent = "Please fill in your name, email and message.";
        return;
      }

      // Very light email check
      if (emailVal.indexOf("@") === -1 || emailVal.indexOf(".") === -1) {
        statusEl.hidden = false;
        statusEl.classList.add("is-error");
        statusEl.textContent = "Please enter a valid email address.";
        return;
      }

      statusEl.hidden = false;
      statusEl.classList.remove("is-error");
      // CHANGE THIS: thank-you message after “sending”
      statusEl.textContent =
        "Thanks, " +
        nameVal +
        "! Your message is ready — this demo form doesn’t send email yet, but your site layout works. Check the README when you want real messages.";

      form.reset();
    });
  }
})();
