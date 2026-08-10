(function () {
  "use strict";

  // Placeholder answers — swap these for Sallee's real answers any time.
  // Each entry picks two of the three comic characters: one "asks" (front
  // panel), one "answers" (reverse panel). Mixed up on purpose so it's
  // never the same pair every time — but always exactly two per Q&A.
  var CHARACTERS = {
    bird: "assets/images/char-bird.png",
    crocodile: "assets/images/char-crocodile.png",
    frog: "assets/images/char-frog.png"
  };

  var QA = {
    pricing: {
      q: "What is your pricing structure?",
      a: "It depends on the piece — commissions usually start with a flat design fee, plus scope for size and medium. I'll always send a clear quote before starting.",
      asker: "bird",
      answerer: "crocodile"
    },
    location: {
      q: "Where are you based?",
      a: "I'm based in Alberta, Canada, and happy to work with clients remotely wherever they are.",
      asker: "crocodile",
      answerer: "frog"
    },
    recent: {
      q: "What have you worked on recently?",
      a: "Most recently, I have been working on the University of Calgary's academic student probation initiative, as well as a communication media film mural, as well as Orca 2026 acrylic painting.",
      asker: "bird",
      answerer: "frog"
    },
    engagement: {
      q: "How do you typically start a new engagement?",
      a: "With a conversation about your vision, timeline, and budget — then I sketch a couple of directions before we commit to a final concept together.",
      asker: "crocodile",
      answerer: "bird"
    }
  };
  var CUSTOM_PAIR = { asker: "frog", answerer: "crocodile" };

  // Same Formspree form as js/contact.js — visitor-submitted AMA questions land
  // in the same inbox. TODO(Sallee): update this alongside the one in contact.js.
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID";
  var CONTACT_EMAIL = "salleeschaerer@gmail.com";
  var isFormspreeConfigured = FORMSPREE_ENDPOINT.indexOf("REPLACE_WITH_YOUR_FORM_ID") === -1;

  var chips = document.querySelectorAll(".ama-chip[data-qa]");
  var overlay = document.querySelector(".ama-modal-overlay");
  var panel = document.getElementById("ama-comic-strip");
  var closeBtn = document.querySelector(".ama-modal .close-btn");
  var customForm = document.getElementById("ama-custom-form");
  var customInput = document.getElementById("ama-custom-input");
  var customStatus = document.getElementById("ama-custom-status");

  if (!overlay || !panel) return;

  function sendCustomQuestion(question) {
    if (!isFormspreeConfigured) {
      var mailto = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent("Ask Me Anything — visitor question") +
        "&body=" + encodeURIComponent(question);
      window.location.href = mailto;
      if (customStatus) customStatus.textContent = "Opening your email app so you can send this question directly.";
      return;
    }
    if (customStatus) customStatus.textContent = "Sending your question…";
    fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ question: question, _subject: "Ask Me Anything — visitor question" })
    })
      .then(function (res) {
        if (customStatus) {
          customStatus.textContent = res.ok
            ? "Sent! Sallee will get your question."
            : "Something went wrong — please email " + CONTACT_EMAIL + " directly.";
        }
      })
      .catch(function () {
        if (customStatus) customStatus.textContent = "Something went wrong — please email " + CONTACT_EMAIL + " directly.";
      });
  }

  function makeFigure(charKey) {
    var fig = document.createElement("div");
    fig.className = "comic-figure";
    var img = document.createElement("img");
    img.src = CHARACTERS[charKey];
    img.alt = "";
    fig.appendChild(img);
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
      sendCustomQuestion(question);
      openModal(
        question,
        "Great question! I don't have this one answered yet, but it's been sent my way — I'll follow up soon. Feel free to reach out directly through the contact form below too.",
        CUSTOM_PAIR.asker,
        CUSTOM_PAIR.answerer
      );
      customInput.value = "";
    });
  }
})();
