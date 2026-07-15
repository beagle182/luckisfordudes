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

  // ----- Contact form → /api/contact (Resend on Vercel) -----
  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (form && statusEl) {
    function showContactStatus(message, isError) {
      statusEl.hidden = false;
      statusEl.classList.toggle("is-error", !!isError);
      statusEl.textContent = message;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = form.elements.namedItem("name");
      var email = form.elements.namedItem("email");
      var subject = form.elements.namedItem("subject");
      var message = form.elements.namedItem("message");
      var website = form.elements.namedItem("website");

      var nameVal = name && "value" in name ? String(name.value).trim() : "";
      var emailVal = email && "value" in email ? String(email.value).trim() : "";
      var subjectVal =
        subject && "value" in subject ? String(subject.value).trim() : "";
      var messageVal =
        message && "value" in message ? String(message.value).trim() : "";
      var websiteVal =
        website && "value" in website ? String(website.value).trim() : "";

      if (!nameVal || !emailVal || !messageVal) {
        showContactStatus("Please fill in your name, email and message.", true);
        return;
      }

      if (emailVal.indexOf("@") === -1 || emailVal.indexOf(".") === -1) {
        showContactStatus("Please enter a valid email address.", true);
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }
      showContactStatus("Sending your message…", false);

      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          subject: subjectVal,
          message: messageVal,
          website: websiteVal,
        }),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.data && result.data.ok) {
            showContactStatus(
              result.data.message ||
                "Thanks! Your message is on its way — we’ll reply soon.",
              false
            );
            form.reset();
          } else {
            showContactStatus(
              (result.data && result.data.error) ||
                "Something went wrong. Please try again or email us directly.",
              true
            );
          }
        })
        .catch(function () {
          showContactStatus(
            "Could not reach the server. Check your connection, or email us directly.",
            true
          );
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send message";
          }
        });
    });
  }

  // ----- Category filter (sub-brand shop pages, e.g. Inches) -----
  // Buttons with data-filter="all|tshirts|mugs|keyrings" show/hide
  // blocks with data-category-block and cards with data-category.
  var filterBar = document.querySelector(".category-filter");
  if (filterBar) {
    var chips = filterBar.querySelectorAll("[data-filter]");
    var blocks = document.querySelectorAll("[data-category-block]");
    var emptyEl = document.getElementById("filter-empty");

    function applyFilter(filter) {
      var visibleCount = 0;

      chips.forEach(function (chip) {
        var active = chip.getAttribute("data-filter") === filter;
        chip.classList.toggle("is-active", active);
        chip.setAttribute("aria-pressed", active ? "true" : "false");
      });

      blocks.forEach(function (block) {
        var cat = block.getAttribute("data-category-block");
        var show = filter === "all" || cat === filter;
        block.hidden = !show;
        if (show) {
          var cards = block.querySelectorAll(".product-card");
          visibleCount += cards.length;
        }
      });

      if (emptyEl) {
        emptyEl.hidden = visibleCount > 0;
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        applyFilter(chip.getAttribute("data-filter") || "all");
      });
    });

    // Honour URL hash on load (#tshirts, #mugs, #keyrings)
    var hash = (window.location.hash || "").replace("#", "");
    if (hash === "tshirts" || hash === "mugs" || hash === "keyrings") {
      applyFilter(hash);
    }
  }
})();
