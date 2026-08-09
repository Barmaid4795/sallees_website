(function () {
  "use strict";

  var html = document.documentElement;

  // Fine pointer (mouse) detection — gates custom cursor + hover-only interactions
  var isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  html.classList.toggle("fine-pointer", isFinePointer);

  // First-load berry rain — falls from the top, lands bottom-left near the footer bear
  function spawnBerryRain() {
    var count = 22;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    for (var i = 0; i < count; i++) {
      var size = 20 + Math.random() * 26;
      var startTop = -(size + Math.random() * 260);
      var left = Math.random() * Math.min(vw * 0.9, vw - size);
      var landY = vh - (36 + Math.random() * 70);
      var drop = document.createElement("div");
      drop.className = "berry-rain-drop";
      drop.style.setProperty("--size", size + "px");
      drop.style.left = left + "px";
      drop.style.top = startTop + "px";
      drop.style.setProperty("--ty", (landY - startTop) + "px");
      drop.style.setProperty("--tx", Math.round(Math.random() * 60 - 30) + "px");
      drop.style.setProperty("--tr", Math.round(Math.random() * 300 - 150) + "deg");
      drop.style.animationDuration = (1.1 + Math.random() * 0.6) + "s";
      drop.style.animationDelay = Math.round(Math.random() * 900) + "ms";
      document.body.appendChild(drop);
      (function (el) {
        el.addEventListener("animationend", function () { el.remove(); });
      })(drop);
    }
  }

  // Trigger the first-load entrance animation (+ berry rain), only once
  var entered = false;
  function triggerEntrance() {
    if (entered) return;
    entered = true;
    html.classList.add("loaded");
    spawnBerryRain();
  }
  window.addEventListener("load", function () {
    requestAnimationFrame(triggerEntrance);
  });
  // Fallback in case 'load' already fired or is slow
  setTimeout(triggerEntrance, 1200);

  // Mobile menu toggle
  var navToggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Active nav link highlighting
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");
  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              link.classList.toggle("active", link.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  // Etsy shop link — not live yet, so clicking shows a quiet "coming soon" note instead
  var etsyLink = document.getElementById("etsy-link");
  var etsyNote = document.getElementById("etsy-note");
  if (etsyLink && etsyNote) {
    etsyLink.addEventListener("click", function (e) {
      e.preventDefault();
      etsyNote.textContent = "Coming soon!";
      etsyNote.classList.add("show");
    });
  }

  // Scroll-reveal for below-the-fold content
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }
})();
