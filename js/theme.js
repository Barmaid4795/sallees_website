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
  var RUN_DURATION = 900;   // matches --run-duration on .berry-runner
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

  function spawnRunner(fromTheme) {
    var rect = toggle.getBoundingClientRect();
    var runner = document.createElement("div");
    runner.className = "berry-runner";
    runner.style.setProperty("--runner-img", "url(\"" + BERRY_IMG[fromTheme] + "\")");
    runner.style.setProperty("--size", rect.width + "px");
    runner.style.setProperty("--run-duration", RUN_DURATION + "ms");
    // Start just off the right edge (roughly where the toggle already
    // lives) and sprint left across the whole screen, at the same height
    // the toggle sits at.
    runner.style.right = "-70px";
    runner.style.top = rect.top + "px";
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
    }, CLEANUP_AT);
  });
})();
