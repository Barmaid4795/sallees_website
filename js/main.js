(function () {
  "use strict";

  var html = document.documentElement;
  var berryToggle = document.querySelector(".berry-toggle");

  // Fine pointer (mouse) detection — gates custom cursor + hover-only interactions
  var isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  html.classList.toggle("fine-pointer", isFinePointer);

  // 40 hand-painted blueberries — one is picked at random per drop/tumble in icy theme
  var BLUEBERRY_COUNT = 40;
  function randomBlueberryImg() {
    var n = 1 + Math.floor(Math.random() * BLUEBERRY_COUNT);
    return "assets/icons/blueberries/blueberry-" + (n < 10 ? "0" + n : n) + ".png";
  }

  // First-load berry rain — falls from the top, lands bottom-left near the footer bear
  function spawnBerryRain() {
    var icy = html.getAttribute("data-theme") !== "warm";
    var count = icy ? 32 : 22;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    for (var i = 0; i < count; i++) {
      var berryImg = icy ? randomBlueberryImg() : "assets/icons/berry-toggle.png";
      var size = icy ? (24 + Math.random() * 38) : (20 + Math.random() * 26);
      var startTop = -(size + Math.random() * 260);
      var left = Math.random() * Math.min(vw * 0.9, vw - size);
      var landY = vh - (36 + Math.random() * 70);
      var drop = document.createElement("div");
      drop.className = "berry-rain-drop";
      drop.style.setProperty("--size", size + "px");
      drop.style.backgroundImage = "url(\"" + berryImg + "\")";
      drop.style.left = left + "px";
      drop.style.top = startTop + "px";
      drop.style.setProperty("--ty", (landY - startTop) + "px");
      drop.style.setProperty("--tx", Math.round(Math.random() * (icy ? 100 : 60) - (icy ? 50 : 30)) + "px");
      drop.style.setProperty("--tr", Math.round(Math.random() * (icy ? 480 : 300) - (icy ? 240 : 150)) + "deg");
      drop.style.animationDuration = (icy ? (1.0 + Math.random() * 0.8) : (1.1 + Math.random() * 0.6)) + "s";
      drop.style.animationDelay = Math.round(Math.random() * 900) + "ms";
      document.body.appendChild(drop);
      (function (el) {
        el.addEventListener("animationend", function () { el.remove(); });
      })(drop);
    }
  }

  // One special berry — with its own little arms and legs, and a real
  // parachute canopy — floats down out of the rain and lands exactly on
  // the theme toggle's spot. It's the opposite fruit from the general
  // rain, matching what the toggle itself displays (see .berry-icon-icy
  // / .berry-icon-warm in css/sections.css: icy mode shows a strawberry,
  // warm mode shows a blueberry).
  function spawnParachuteBerry() {
    var icy = html.getAttribute("data-theme") !== "warm";
    // Root-relative (leading "/"): this feeds --runner-img, consumed as
    // background-image: var(...) in css/sections.css — url() inside a
    // custom property resolves against the *stylesheet's* location, not
    // the page's, so a plain relative path here would 404.
    var berryImg = icy ? "/assets/icons/berry-toggle.png" : "/assets/icons/blueberry-toggle.png";
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    var SPRITE = 58, CANOPY_H = 30, STRING_LEN = 14, RIG_W = 86;
    var rigH = SPRITE + STRING_LEN + CANOPY_H;

    // Mirrors .berry-toggle's fixed right:22px/bottom:22px/58px box in
    // css/sections.css — the sprite itself (not the canopy/strings above
    // it) needs to land there, so the rig's own top/left is offset up
    // and over to compensate.
    var spriteLandLeft = vw - 22 - 58 + (58 - SPRITE) / 2;
    var spriteLandTop = vh - 22 - 58 + (58 - SPRITE) / 2;
    var landLeft = spriteLandLeft - (RIG_W - SPRITE) / 2;
    var landTop = spriteLandTop - STRING_LEN - CANOPY_H;
    var startTop = -(rigH + 80);
    // Starts drifting in from the horizontal center of the screen, then
    // glides over to the toggle's corner as it descends (not a straight
    // drop straight down at the corner).
    var startLeft = vw / 2 - RIG_W / 2;

    var drop = document.createElement("div");
    drop.className = "berry-parachute";
    drop.style.setProperty("--size", SPRITE + "px");
    drop.style.width = RIG_W + "px";
    drop.style.height = rigH + "px";
    drop.style.left = startLeft + "px";
    drop.style.top = startTop + "px";
    drop.style.setProperty("--tx", (landLeft - startLeft) + "px");
    drop.style.setProperty("--ty", (landTop - startTop) + "px");

    var canopy = document.createElement("div");
    canopy.className = "berry-parachute-canopy";
    drop.appendChild(canopy);

    var stringL = document.createElement("span");
    stringL.className = "berry-parachute-string berry-parachute-string-l";
    drop.appendChild(stringL);
    var stringR = document.createElement("span");
    stringR.className = "berry-parachute-string berry-parachute-string-r";
    drop.appendChild(stringR);

    var windA = document.createElement("span");
    windA.className = "berry-parachute-wind berry-parachute-wind-a";
    drop.appendChild(windA);
    var windB = document.createElement("span");
    windB.className = "berry-parachute-wind berry-parachute-wind-b";
    drop.appendChild(windB);

    var sprite = document.createElement("div");
    sprite.className = "berry-runner-sprite berry-parachute-sprite";

    function makeLimb(cls) {
      var limb = document.createElement("div");
      limb.className = "berry-limb " + cls;
      var lower = document.createElement("div");
      lower.className = "berry-limb-lower";
      limb.appendChild(lower);
      return limb;
    }
    sprite.appendChild(makeLimb("berry-arm berry-arm-back"));
    var body = document.createElement("div");
    body.className = "berry-runner-body";
    body.style.setProperty("--runner-img", "url(\"" + berryImg + "\")");
    sprite.appendChild(body);
    sprite.appendChild(makeLimb("berry-leg berry-leg-a"));
    sprite.appendChild(makeLimb("berry-leg berry-leg-b"));
    sprite.appendChild(makeLimb("berry-arm berry-arm-front"));

    drop.appendChild(sprite);
    document.body.appendChild(drop);
    drop.addEventListener("animationend", function () {
      drop.remove();
      if (berryToggle) berryToggle.classList.add("ready");
    });
  }

  // Trigger the first-load entrance animation (+ berry rain), only once
  var entered = false;
  function triggerEntrance() {
    if (entered) return;
    entered = true;
    html.classList.add("loaded");
    spawnBerryRain();
    spawnParachuteBerry();
    // Safety net: the toggle is a real control, not just decoration, so
    // it must never stay stuck invisible if the parachute's animationend
    // somehow doesn't fire (interrupted animation, reduced-motion
    // shortening it unexpectedly, etc). Matches parachute delay (700ms)
    // + duration (3100ms) with headroom.
    setTimeout(function () {
      if (berryToggle) berryToggle.classList.add("ready");
    }, 4300);
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
