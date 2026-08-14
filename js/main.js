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

  // First-load berry rain — falls from underneath the .entrance-cloud
  // shapes (css/animations.css), lands bottom-left near the footer bear
  var CLOUD_CENTERS = [0.12, 0.36, 0.62, 0.85]; // matches .entrance-cloud-1..4 roughly

  function spawnOneRainDrop(left, delayMs) {
    var icy = html.getAttribute("data-theme") !== "warm";
    var berryImg = icy ? randomBlueberryImg() : "assets/icons/berry-toggle.png";
    var size = icy ? (24 + Math.random() * 38) : (20 + Math.random() * 26);
    var startTop = -(size + Math.random() * 40);
    var vh = window.innerHeight;
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
    drop.style.animationDelay = (delayMs != null ? delayMs : Math.round(Math.random() * 900)) + "ms";
    document.body.appendChild(drop);
    drop.addEventListener("animationend", function () { drop.remove(); });
  }

  function spawnBerryRain() {
    var count = (html.getAttribute("data-theme") !== "warm") ? 32 : 22;
    var vw = window.innerWidth;
    for (var i = 0; i < count; i++) {
      var cloudCenter = CLOUD_CENTERS[Math.floor(Math.random() * CLOUD_CENTERS.length)];
      var left = Math.max(0, Math.min(vw - 40, vw * cloudCenter + (Math.random() * 90 - 45)));
      spawnOneRainDrop(left);
    }
  }

  // Clouds are interactive: hover glows them (pure CSS, see
  // .entrance-cloud:hover), and clicking one shakes loose a little
  // extra flurry of berries from right underneath it, with a quick
  // brightness "poke" reaction on the cloud itself.
  function wireCloudInteraction() {
    document.querySelectorAll(".entrance-cloud").forEach(function (cloud) {
      cloud.addEventListener("click", function () {
        cloud.animate(
          [{ filter: "brightness(1.4)" }, { filter: "brightness(1)" }],
          { duration: 450, easing: "ease-out" }
        );
        var rect = cloud.getBoundingClientRect();
        for (var i = 0; i < 5; i++) {
          var left = rect.left + Math.random() * rect.width;
          spawnOneRainDrop(left, Math.round(Math.random() * 200));
        }
      });
    });
  }

  // The parachute canopy: a real 5-gore dome (curved panels fanning out
  // from an apex, alternating colors, scalloped hem) with rigging lines
  // converging to a single ring — modeled directly on a reference photo
  // of a candy-striped parachute carrying a berry. Built as one inline
  // SVG string rather than CSS gradients/rotated divs, since that's the
  // only way to get the curved gore edges, the scalloped hem, and the
  // lines meeting at one exact point. Colors follow the fruit it's
  // carrying: red/cream for the strawberry (icy theme), blue/cream for
  // the blueberry (warm theme).
  function buildParachuteCanopySVG(icy) {
    var colorA = icy ? "#D6394C" : "#3E63B0";
    var edgeA = icy ? "#A5233A" : "#28407C";
    var colorB = "#FBF1DE";
    var edgeB = "#DCC79A";
    var cord = "#C9A66B";
    return (
      '<svg viewBox="0 0 104 92" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<g stroke-linejoin="round" stroke-width="1.2">' +
          '<path d="M52,4 Q17,17 4,42 Q14,52 24,42 Q32,17 52,4 Z" fill="' + colorA + '" stroke="' + edgeA + '"/>' +
          '<path d="M52,4 Q32,17 24,42 Q33,52 42,42 Q45,17 52,4 Z" fill="' + colorB + '" stroke="' + edgeB + '"/>' +
          '<path d="M52,4 Q45,17 42,42 Q52,52 62,42 Q59,17 52,4 Z" fill="' + colorA + '" stroke="' + edgeA + '"/>' +
          '<path d="M52,4 Q59,17 62,42 Q71,52 80,42 Q72,17 52,4 Z" fill="' + colorB + '" stroke="' + edgeB + '"/>' +
          '<path d="M52,4 Q72,17 80,42 Q90,52 100,42 Q87,17 52,4 Z" fill="' + colorA + '" stroke="' + edgeA + '"/>' +
        '</g>' +
        '<ellipse cx="40" cy="15" rx="17" ry="7" fill="#ffffff" opacity="0.22" transform="rotate(-10 40 15)"/>' +
        '<g stroke="' + cord + '" stroke-width="1.3" stroke-linecap="round" opacity="0.9">' +
          '<line x1="14" y1="52" x2="52" y2="84"/>' +
          '<line x1="33" y1="52" x2="52" y2="84"/>' +
          '<line x1="52" y1="52" x2="52" y2="84"/>' +
          '<line x1="71" y1="52" x2="52" y2="84"/>' +
          '<line x1="90" y1="52" x2="52" y2="84"/>' +
          '<line x1="52" y1="88" x2="52" y2="92"/>' +
        '</g>' +
        '<circle cx="52" cy="84" r="4" fill="none" stroke="' + cord + '" stroke-width="1.6"/>' +
      '</svg>'
    );
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

    // Keep these in sync with the .berry-parachute-canopy box size in
    // css/animations.css (width/height there = RIG_W / CANOPY_H + STRING_LEN)
    // and with the viewBox in buildParachuteCanopySVG above.
    var SPRITE = 58, CANOPY_H = 52, STRING_LEN = 40, RIG_W = 104;
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
    canopy.innerHTML = buildParachuteCanopySVG(icy);
    drop.appendChild(canopy);

    var windA = document.createElement("span");
    windA.className = "berry-parachute-wind berry-parachute-wind-a";
    drop.appendChild(windA);
    var windB = document.createElement("span");
    windB.className = "berry-parachute-wind berry-parachute-wind-b";
    drop.appendChild(windB);

    var sprite = document.createElement("div");
    sprite.className = "berry-runner-sprite berry-parachute-sprite " + (icy ? "is-strawberry" : "is-blueberry");

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
  wireCloudInteraction();

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
