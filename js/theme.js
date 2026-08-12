(function () {
  "use strict";

  var html = document.documentElement;
  var toggle = document.querySelector(".berry-toggle");
  var overlay = document.querySelector(".theme-wash-overlay");
  if (!toggle || !overlay) return;

  var THEME_COLORS = { warm: "#5D51A1", icy: "#3E6B8A" };
  var TUMBLE_COUNT = 16;
  var BLUEBERRY_COUNT = 40;
  function randomBlueberryImg() {
    var n = 1 + Math.floor(Math.random() * BLUEBERRY_COUNT);
    return "assets/icons/blueberries/blueberry-" + (n < 10 ? "0" + n : n) + ".png";
  }

  var saved = localStorage.getItem("sallee-theme");
  if (saved === "warm") {
    html.setAttribute("data-theme", "warm");
  }

  function currentTheme() {
    return html.getAttribute("data-theme") === "warm" ? "warm" : "icy";
  }

  function spawnTumble(theme) {
    var icy = theme === "icy";
    var count = icy ? 28 : TUMBLE_COUNT;
    var rect = toggle.getBoundingClientRect();
    var originX = rect.left + rect.width / 2;
    var originY = rect.top + rect.height / 2;
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    for (var i = 0; i < count; i++) {
      var berryImg = icy ? randomBlueberryImg() : "assets/icons/berry-toggle.png";
      var size = icy ? (36 + Math.random() * 46) : (30 + Math.random() * 30);
      var berry = document.createElement("div");
      berry.className = "berry-tumble";
      berry.style.setProperty("--size", size + "px");
      berry.style.backgroundImage = "url(\"" + berryImg + "\")";
      berry.style.left = (originX - size / 2) + "px";
      berry.style.top = (originY - size / 2) + "px";
      berry.style.setProperty("--tx", -(0.15 + Math.random() * (icy ? 1.25 : 0.95)) * vw + "px");
      berry.style.setProperty("--ty", -(0.1 + Math.random() * (icy ? 0.95 : 0.75)) * vh + "px");
      berry.style.setProperty("--tr", (Math.random() * (icy ? 1080 : 720) - (icy ? 540 : 360)) + "deg");
      berry.style.animationDelay = Math.round(Math.random() * 220) + "ms";
      berry.style.animationDuration = icy ? (1.3 + Math.random() * 0.35) + "s" : "";
      document.body.appendChild(berry);
      (function (el) {
        el.addEventListener("animationend", function () {
          el.remove();
        });
      })(berry);
    }
  }

  toggle.addEventListener("click", function () {
    if (toggle.classList.contains("popping")) return;

    var next = currentTheme() === "icy" ? "warm" : "icy";
    overlay.style.setProperty("--wash-color", THEME_COLORS[next]);

    toggle.classList.add("popping");
    overlay.classList.remove("washing");
    // force reflow so the animation can restart every click
    void overlay.offsetWidth;
    overlay.classList.add("washing");
    spawnTumble(next);

    setTimeout(function () {
      html.setAttribute("data-theme", next);
      localStorage.setItem("sallee-theme", next);
    }, 480);

    setTimeout(function () {
      toggle.classList.remove("popping");
      overlay.classList.remove("washing");
    }, 950);
  });
})();
