(function () {
  "use strict";

  var html = document.documentElement;

  // Touch/keyboard devices: tap the card to flip instead of relying on :hover
  document.querySelectorAll(".flip-card").forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (html.classList.contains("fine-pointer")) return; // hover handles it
      var interactive = e.target.closest("a, button");
      if (interactive) return; // let real links/buttons work
      card.classList.toggle("is-flipped");
    });
  });

  // Mild deterrent against casual right-click-save/drag of artwork — not a real security measure
  document.querySelectorAll(".flip-front img, .hero-art img, .mural-scroll img, .about-portrait img").forEach(function (img) {
    img.setAttribute("draggable", "false");
    img.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  });

  // Filter chips for the Art & Design gallery (medium filter)
  var filterRow = document.querySelector(".art-filters");
  if (filterRow) {
    var chips = filterRow.querySelectorAll(".filter-chip");
    var cards = document.querySelectorAll("#art-gallery .flip-card");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        var medium = chip.getAttribute("data-medium");
        cards.forEach(function (card) {
          var match = medium === "all" || card.getAttribute("data-medium") === medium;
          card.style.display = match ? "" : "none";
        });
      });
    });
  }
})();
