(function () {
  "use strict";

  // Placeholder answers — swap these for Sallee's real answers any time.
  var QA = {
    pricing: {
      q: "What is your pricing structure?",
      a: "It depends on the piece — commissions usually start with a flat design fee, plus scope for size and medium. I'll always send a clear quote before starting."
    },
    location: {
      q: "Where are you based?",
      a: "I'm based in Alberta, Canada, and happy to work with clients remotely wherever they are."
    },
    leadership: {
      q: "What is fractional design leadership?",
      a: "It's when a client brings me on part-time to guide the creative direction of a project without hiring a full-time designer — think of it as renting an art director for exactly as long as you need one."
    },
    recent: {
      q: "What have you worked on recently?",
      a: "Most recently, logo and banner design for UCalgary's Indigenous Student Resource Page, plus a big mural piece and a new acrylic painting, Orca 2026."
    },
    engagement: {
      q: "How do you typically start a new engagement?",
      a: "With a conversation about your vision, timeline, and budget — then I sketch a couple of directions before we commit to a final concept together."
    }
  };

  var chips = document.querySelectorAll(".ama-chip[data-qa]");
  var overlay = document.querySelector(".ama-modal-overlay");
  var panel = document.getElementById("ama-comic-strip");
  var closeBtn = document.querySelector(".ama-modal .close-btn");
  var customForm = document.getElementById("ama-custom-form");
  var customInput = document.getElementById("ama-custom-input");

  if (!overlay || !panel) return;

  function makePanel(charId, speaker, line, reverse) {
    var wrap = document.createElement("div");
    wrap.className = reverse ? "comic-panel reverse" : "comic-panel";

    var fig = document.createElement("div");
    fig.className = "comic-figure";
    fig.innerHTML = '<svg><use href="assets/icons/ama-characters.svg#' + charId + '"></use></svg>';

    var bubble = document.createElement("div");
    bubble.className = "speech-bubble";
    var strong = document.createElement("strong");
    strong.textContent = speaker + ":";
    bubble.appendChild(strong);
    bubble.appendChild(document.createTextNode(" " + line));

    wrap.appendChild(fig);
    wrap.appendChild(bubble);
    return wrap;
  }

  function buildPanel(question, answer) {
    panel.innerHTML = "";
    panel.appendChild(makePanel("char-fox", "Fox", question, false));
    panel.appendChild(makePanel("char-bear", "Bear", answer, true));
  }

  function openModal(question, answer) {
    buildPanel(question, answer);
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
      if (entry) openModal(entry.q, entry.a);
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
        "Great question! Sallee hasn't recorded a real answer for this one yet — check back soon, or reach out directly through the contact form below."
      );
      customInput.value = "";
    });
  }
})();
