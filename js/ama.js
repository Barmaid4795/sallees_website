(function () {
  "use strict";

  // Placeholder answers — swap these for Sallee's real answers any time.
  // Each entry picks two of the five comic characters: one "asks" (front
  // panel), one "answers" (reverse panel). Mixed up on purpose so it's
  // never the same pair every time — but always exactly two per Q&A.
  var CHARACTERS = {
    fox: { type: "svg", id: "char-fox" },
    bear: { type: "svg", id: "char-bear" },
    bird: { type: "img", src: "assets/images/char-bird.png" },
    crocodile: { type: "img", src: "assets/images/char-crocodile.png" },
    frog: { type: "img", src: "assets/images/char-frog.png" }
  };

  var QA = {
    pricing: {
      q: "What is your pricing structure?",
      a: "It depends on the piece — commissions usually start with a flat design fee, plus scope for size and medium. I'll always send a clear quote before starting.",
      asker: "fox",
      answerer: "bear"
    },
    location: {
      q: "Where are you based?",
      a: "I'm based in Alberta, Canada, and happy to work with clients remotely wherever they are.",
      asker: "bird",
      answerer: "frog"
    },
    leadership: {
      q: "What is fractional design leadership?",
      a: "It's when a client brings me on part-time to guide the creative direction of a project without hiring a full-time designer — think of it as renting an art director for exactly as long as you need one.",
      asker: "crocodile",
      answerer: "fox"
    },
    recent: {
      q: "What have you worked on recently?",
      a: "Most recently, logo and banner design for UCalgary's Indigenous Student Resource Page, plus a big mural piece and a new acrylic painting, Orca 2026.",
      asker: "bear",
      answerer: "bird"
    },
    engagement: {
      q: "How do you typically start a new engagement?",
      a: "With a conversation about your vision, timeline, and budget — then I sketch a couple of directions before we commit to a final concept together.",
      asker: "frog",
      answerer: "crocodile"
    }
  };
  var CUSTOM_PAIR = { asker: "fox", answerer: "bear" };

  var chips = document.querySelectorAll(".ama-chip[data-qa]");
  var overlay = document.querySelector(".ama-modal-overlay");
  var panel = document.getElementById("ama-comic-strip");
  var closeBtn = document.querySelector(".ama-modal .close-btn");
  var customForm = document.getElementById("ama-custom-form");
  var customInput = document.getElementById("ama-custom-input");

  if (!overlay || !panel) return;

  function makeFigure(charKey) {
    var character = CHARACTERS[charKey];
    var fig = document.createElement("div");
    fig.className = "comic-figure";
    if (character.type === "svg") {
      fig.innerHTML = '<svg><use href="assets/icons/ama-characters.svg#' + character.id + '"></use></svg>';
    } else {
      var img = document.createElement("img");
      img.src = character.src;
      img.alt = "";
      fig.appendChild(img);
    }
    return fig;
  }

  function makePanel(charKey, line, reverse) {
    var wrap = document.createElement("div");
    wrap.className = reverse ? "comic-panel reverse" : "comic-panel";

    var bubble = document.createElement("div");
    bubble.className = "speech-bubble";
    bubble.textContent = line;

    wrap.appendChild(makeFigure(charKey));
    wrap.appendChild(bubble);
    return wrap;
  }

  function buildPanel(question, answer, asker, answerer) {
    panel.innerHTML = "";
    panel.appendChild(makePanel(asker, question, false));
    panel.appendChild(makePanel(answerer, answer, true));
  }

  function openModal(question, answer, asker, answerer) {
    buildPanel(question, answer, asker, answerer);
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var key = chip.getAttribute("data-qa");
      var entry = QA[key];
      if (entry) openModal(entry.q, entry.a, entry.asker, entry.answerer);
    });
  });

  closeBtn && closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });

  if (customForm && customInput) {
    customForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var question = customInput.value.trim();
      if (!question) return;
      openModal(
        question,
        "Great question! Sallee hasn't recorded a real answer for this one yet — check back soon, or reach out directly through the contact form below.",
        CUSTOM_PAIR.asker,
        CUSTOM_PAIR.answerer
      );
      customInput.value = "";
    });
  }
})();
