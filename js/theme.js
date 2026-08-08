(function () {
  "use strict";

  var html = document.documentElement;
  var bucket = document.querySelector(".bucket-toggle");
  var overlay = document.querySelector(".paint-pour-overlay");
  if (!bucket || !overlay) return;

  var THEME_COLORS = { warm: "#5D51A1", icy: "#3E6B8A" };

  var saved = localStorage.getItem("sallee-theme");
  if (saved === "icy") {
    html.setAttribute("data-theme", "icy");
  }

  function currentTheme() {
    return html.getAttribute("data-theme") === "icy" ? "icy" : "warm";
  }

  bucket.addEventListener("click", function () {
    if (bucket.classList.contains("pouring")) return;

    var next = currentTheme() === "icy" ? "warm" : "icy";
    overlay.style.setProperty("--pour-color", THEME_COLORS[next]);

    bucket.classList.add("pouring");
    overlay.classList.remove("pouring");
    // force reflow so the animation can restart every click
    void overlay.offsetWidth;
    overlay.classList.add("pouring");

    setTimeout(function () {
      html.setAttribute("data-theme", next);
      localStorage.setItem("sallee-theme", next);
    }, 480);

    setTimeout(function () {
      bucket.classList.remove("pouring");
      overlay.classList.remove("pouring");
    }, 950);
  });
})();
