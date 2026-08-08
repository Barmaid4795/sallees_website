(function () {
  "use strict";

  var rail = document.createElement("div");
  rail.className = "footprint-rail";
  rail.setAttribute("aria-hidden", "true");
  document.body.appendChild(rail);

  function build() {
    rail.innerHTML = "";
    var totalHeight = document.documentElement.scrollHeight;
    var footer = document.querySelector(".site-footer");
    var footerTop = footer ? footer.getBoundingClientRect().top + window.scrollY : totalHeight;
    var startY = Math.min(window.innerHeight * 0.85, 700);
    var endY = footerTop - 70; // stop the trail before it reaches the footer
    var y = startY;
    var i = 0;
    var prints = [];

    while (y < endY) {
      var progress = y / totalHeight;
      var gap = 56 + progress * progress * 160; // tight "walking" steps widen into "running" strides
      var side = i % 2 === 0 ? 1 : -1;
      var rightOffset = 10 + (side === 1 ? 0 : 14);
      var rotate = side === 1 ? -16 : 16;

      var el = document.createElement("span");
      el.className = "bear-print";
      el.style.top = y + "px";
      el.style.right = rightOffset + "px";
      el.style.setProperty("--rot", rotate + "deg");
      el.style.transitionDelay = (i % 6) * 40 + "ms";
      el.innerHTML = '<svg viewBox="0 0 100 100"><use href="assets/icons/bear-print.svg#"></use></svg>';
      rail.appendChild(el);
      prints.push(el);

      y += gap;
      i++;
    }

    // Reserve a spot for a real bear photo/illustration at the end of the trail
    var anchor = document.createElement("span");
    anchor.className = "bear-trail-anchor";
    anchor.style.top = Math.min(y, endY) + "px";
    anchor.innerHTML = '<img src="assets/images/bear-trail.png" alt="A bear, following its tracks">';
    rail.appendChild(anchor);
    prints.push(anchor);

    return prints;
  }

  function observe(prints) {
    if (!("IntersectionObserver" in window)) {
      prints.forEach(function (p) { p.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );
    prints.forEach(function (p) { io.observe(p); });
  }

  function rebuild() {
    observe(build());
  }

  rebuild();

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(rebuild, 400);
  });

  // Rebuild once more shortly after load in case images/fonts shifted document height
  setTimeout(rebuild, 1500);
})();
