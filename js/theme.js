(function () {
  "use strict";

  var html = document.documentElement;
  var toggle = document.querySelector(".berry-toggle");
  var overlay = document.querySelector(".theme-wash-overlay");
  if (!toggle || !overlay) return;

  var THEME_COLORS = { warm: "#5D51A1", icy: "#3E6B8A" };
  var TUMBLE_COUNT = 6;

  var saved = localStorage.getItem("sallee-theme");
  if (saved === "icy") {
    html.setAttribute("data-theme", "icy");
  }

  function currentTheme() {
    return html.getAttribute("data-theme") === "icy" ? "icy" : "warm";
  }

  function spawnTumble() {
    var rect = toggle.getBoundingClientRect();
    var originX = rect.left + rect.width / 2 - 11;
    var originY = rect.top + rect.height / 2 - 11;

    for (var i = 0; i < TUMBLE_COUNT; i++) {
      var berry = document.createElement("div");
      berry.className = "berry-tumble";
      berry.style.left = originX + "px";
      berry.style.top = originY + "px";
      berry.style.setProperty("--tx", -(40 + Math.random() * 130) + "px");
      berry.style.setProperty("--ty", (20 + Math.random() * 90) + "px");
      berry.style.setProperty("--tr", (Math.random() * 500 - 250) + "deg");
      berry.style.animationDelay = Math.round(Math.random() * 110) + "ms";
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
    spawnTumble();

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
