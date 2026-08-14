(function () {
  "use strict";

  var html = document.documentElement;
  var toggle = document.querySelector(".berry-toggle");
  var overlay = document.querySelector(".theme-wash-overlay");
  if (!toggle || !overlay) return;

  // Root-relative (leading "/"): these get injected into CSS custom
  // properties consumed as background-image: var(...) in sections.css, and
  // url() inside a custom property resolves against the *stylesheet's*
  // location, not the page's — a plain relative path would 404 as
  // "css/assets/...".
  var BERRY_IMG = { warm: "/assets/icons/berry-toggle.png", icy: "/assets/icons/blueberry-toggle.png" };
  var BLUEBERRY_COUNT = 40;

  // Keep these in sync with the durations set on .berry-runner /
  // .theme-wash-overlay.washing in sections.css.
  var RUN_DURATION = 2400;  // matches --run-duration on .berry-runner
  var WAVE_DURATION = 2000; // matches the "washing" animation-duration

  var RUN_DELAY = 0; // runner (with legs) sets off immediately
  // The berryRun keyframes put the runner at 66vw (2/3 of the screen) at
  // its 64% keyframe — keyframe percentages are fixed points in time
  // regardless of easing, so 64% of RUN_DURATION is exactly that moment.
  var WAVE_DELAY = Math.round(RUN_DURATION * 0.64);
  // Theme flips while the wave is mid-dwell at full coverage (its
  // keyframes hold 100% coverage from 48%-62% of WAVE_DURATION).
  var SWAP_AT = WAVE_DELAY + Math.round(WAVE_DURATION * 0.54);
  var CLEANUP_AT = WAVE_DELAY + WAVE_DURATION + 50;

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function randomBlueberryImg() {
    var n = 1 + Math.floor(Math.random() * BLUEBERRY_COUNT);
    return "/assets/icons/blueberries/blueberry-" + (n < 10 ? "0" + n : n) + ".png";
  }

  var saved = localStorage.getItem("sallee-theme");
  if (saved === "warm") {
    html.setAttribute("data-theme", "warm");
  }

  function currentTheme() {
    return html.getAttribute("data-theme") === "warm" ? "warm" : "icy";
  }

  var WAVE_BERRY_COUNT = 22;

  function fillWaveBerries(next) {
    overlay.innerHTML = "";
    for (var i = 0; i < WAVE_BERRY_COUNT; i++) {
      var img = next === "icy" ? randomBlueberryImg() : BERRY_IMG.warm;
      var b = document.createElement("div");
      b.className = "wave-berry";
      b.style.setProperty("--wb-img", "url(\"" + img + "\")");
      b.style.setProperty("--wb-size", (22 + Math.random() * 30) + "px");
      b.style.setProperty("--wb-duration", (600 + Math.random() * 900) + "ms");
      b.style.setProperty("--wb-bob-duration", (900 + Math.random() * 900) + "ms");
      // Scattered through the water's fill area (bottom ~70% of the
      // screen); the overlay's own clip-path hides anything that lands
      // above the waterline, so this range can be a little generous.
      b.style.left = (2 + Math.random() * 94) + "%";
      b.style.top = (36 + Math.random() * 56) + "%";
      overlay.appendChild(b);
    }
  }

  function spawnRunner(fromTheme) {
    var rect = toggle.getBoundingClientRect();
    // Bigger than the toggle icon itself so it's easy to see mid-sprint —
    // the berryRun keyframes grow it further still while it runs.
    var size = rect.width * 2.3;

    var runner = document.createElement("div");
    runner.className = "berry-runner";
    runner.style.setProperty("--size", size + "px");
    runner.style.setProperty("--run-duration", RUN_DURATION + "ms");
    // Start just off the right edge (roughly where the toggle already
    // lives) and sprint left across the whole screen. Anchored by
    // "bottom" (not "top") with a healthy margin so the enlarged sprite
    // and its legs stay clear of the bottom edge of the viewport instead
    // of getting clipped.
    runner.style.right = "-70px";
    runner.style.bottom = "70px";

    for (var i = 0; i < 3; i++) {
      var wind = document.createElement("span");
      wind.className = "berry-wind";
      runner.appendChild(wind);
    }

    var sprite = document.createElement("div");
    sprite.className = "berry-runner-sprite";

    function makeLimb(cls) {
      var limb = document.createElement("div");
      limb.className = "berry-limb " + cls;
      var lower = document.createElement("div");
      lower.className = "berry-limb-lower";
      limb.appendChild(lower);
      return limb;
    }

    // Paint order matters here: the back arm goes in before the body
    // image so the round berry occludes most of it (reads as "the other
    // side" of the body), then legs and the front arm paint on top.
    sprite.appendChild(makeLimb("berry-arm berry-arm-back"));

    var body = document.createElement("div");
    body.className = "berry-runner-body";
    body.style.setProperty("--runner-img", "url(\"" + BERRY_IMG[fromTheme] + "\")");
    sprite.appendChild(body);

    sprite.appendChild(makeLimb("berry-leg berry-leg-a"));
    sprite.appendChild(makeLimb("berry-leg berry-leg-b"));
    sprite.appendChild(makeLimb("berry-arm berry-arm-front"));

    runner.appendChild(sprite);

    document.body.appendChild(runner);
    runner.addEventListener("animationend", function () {
      runner.remove();
    });
  }

  toggle.addEventListener("click", function () {
    if (toggle.classList.contains("popping")) return;

    var leaving = currentTheme();
    var next = leaving === "icy" ? "warm" : "icy";
    var waveImg = next === "icy" ? randomBlueberryImg() : BERRY_IMG.warm;

    if (reduceMotion) {
      html.setAttribute("data-theme", next);
      localStorage.setItem("sallee-theme", next);
      return;
    }

    toggle.classList.add("popping");

    setTimeout(function () { spawnRunner(leaving); }, RUN_DELAY);

    setTimeout(function () {
      overlay.style.setProperty("--wave-img", "url(\"" + waveImg + "\")");
      fillWaveBerries(next);
      overlay.classList.remove("washing");
      // force reflow so the animation can restart every click
      void overlay.offsetWidth;
      overlay.classList.add("washing");
    }, WAVE_DELAY);

    setTimeout(function () {
      html.setAttribute("data-theme", next);
      localStorage.setItem("sallee-theme", next);
    }, SWAP_AT);

    setTimeout(function () {
      toggle.classList.remove("popping");
      overlay.classList.remove("washing");
      overlay.innerHTML = "";
    }, CLEANUP_AT);
  });
})();
