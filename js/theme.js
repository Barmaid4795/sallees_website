(function () {
  "use strict";

  var html = document.documentElement;
  var toggle = document.querySelector(".berry-toggle");
  var storm = document.querySelector(".berry-tornado");
  if (!toggle || !storm) return;

  // Root-relative (leading "/"): these get injected into CSS custom
  // properties consumed as background-image: var(...) in sections.css, and
  // url() inside a custom property resolves against the *stylesheet's*
  // location, not the page's — a plain relative path would 404 as
  // "css/assets/...".
  var BERRY_IMG = { warm: "/assets/icons/berry-toggle.png", icy: "/assets/icons/blueberry-toggle.png" };
  var BLUEBERRY_COUNT = 40;

  // Keep these in sync with the durations set on .berry-runner /
  // .berry-tornado.storming in sections.css.
  var RUN_DURATION = 2400;   // matches --run-duration on .berry-runner
  var STORM_DURATION = 3200; // matches the "storming" animation-duration — slower slide in/out

  var RUN_DELAY = 0; // runner (with legs) sets off immediately
  // Storm now arrives much sooner in the chase — around a third of the
  // way across, not two-thirds — so it feels like it's bearing down on
  // the runner rather than lagging behind.
  var STORM_DELAY = Math.round(RUN_DURATION * 0.32);
  // Theme flips while the tornado is mid-dwell, fully overhead (its
  // keyframes hold full coverage from 48%-62% of STORM_DURATION).
  var SWAP_AT = STORM_DELAY + Math.round(STORM_DURATION * 0.54);
  var CLEANUP_AT = STORM_DELAY + STORM_DURATION + 50;

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

  var TORNADO_RINGS = 11;
  var BERRIES_PER_RING = 5;
  var CLOUD_LEFTS = ["12%", "30%", "48%", "66%", "84%"];

  function fillStorm(next) {
    storm.innerHTML = "";

    CLOUD_LEFTS.forEach(function (left) {
      var cloud = document.createElement("div");
      cloud.className = "storm-cloud";
      cloud.style.left = left;
      storm.appendChild(cloud);
    });

    var funnel = document.createElement("div");
    funnel.className = "tornado-funnel";
    for (var r = 0; r < TORNADO_RINGS; r++) {
      var t = r / (TORNADO_RINGS - 1); // 0 (top, narrow) -> 1 (bottom, wide)
      var orbitDir = r % 2 === 0 ? "normal" : "reverse"; // alternating rings for a churning look
      for (var b = 0; b < BERRIES_PER_RING; b++) {
        // Jitter radius and speed per berry (not just per ring) — a
        // bigger, messier, more chaotic-looking funnel instead of neat
        // concentric rings.
        var radius = 18 + t * 230 + (Math.random() * 30 - 15);
        var orbitDur = Math.max(0.35, 1.9 - t * 1.4 + (Math.random() * 0.6 - 0.3)).toFixed(2) + "s";

        var img = next === "icy" ? randomBlueberryImg() : BERRY_IMG.warm;
        var orbit = document.createElement("div");
        orbit.className = "tornado-orbit";
        orbit.style.top = (t * 100 + (Math.random() * 4 - 2)) + "%";
        orbit.style.setProperty("--orbit-dur", orbitDur);
        orbit.style.setProperty("--orbit-dir", orbitDir);
        orbit.style.animationDelay = "-" + (Math.random() * 2.5).toFixed(2) + "s"; // random phase per berry

        var berry = document.createElement("div");
        berry.className = "tornado-berry";
        berry.style.setProperty("--tb-img", "url(\"" + img + "\")");
        berry.style.setProperty("--tb-size", Math.round(18 + t * 26 + Math.random() * 14) + "px");
        berry.style.setProperty("--radius", Math.round(radius) + "px");
        berry.style.setProperty("--tb-spin-dur", Math.round(280 + Math.random() * 600) + "ms");

        orbit.appendChild(berry);
        funnel.appendChild(orbit);
      }
    }
    storm.appendChild(funnel);
  }

  function spawnLightning() {
    var flash = document.createElement("div");
    flash.className = "lightning-flash";
    document.body.appendChild(flash);
    requestAnimationFrame(function () {
      flash.classList.add("flashing");
    });
    flash.addEventListener("animationend", function () {
      flash.remove();
    });
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
    sprite.className = "berry-runner-sprite " + (fromTheme === "warm" ? "is-strawberry" : "is-blueberry");

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

    if (reduceMotion) {
      html.setAttribute("data-theme", next);
      localStorage.setItem("sallee-theme", next);
      return;
    }

    toggle.classList.add("popping");

    setTimeout(function () { spawnRunner(leaving); }, RUN_DELAY);

    setTimeout(function () {
      fillStorm(next);
      spawnLightning();
      storm.classList.remove("storming");
      // force reflow so the animation can restart every click
      void storm.offsetWidth;
      storm.classList.add("storming");
    }, STORM_DELAY);

    setTimeout(function () {
      html.setAttribute("data-theme", next);
      localStorage.setItem("sallee-theme", next);
    }, SWAP_AT);

    setTimeout(function () {
      toggle.classList.remove("popping");
      storm.classList.remove("storming");
      storm.innerHTML = "";
    }, CLEANUP_AT);
  });
})();
