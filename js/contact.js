(function () {
  "use strict";

  // TODO(Sallee): replace with your real Formspree endpoint, e.g.
  // "https://formspree.io/f/abcdwxyz" — create a free form at https://formspree.io
  // The same endpoint is also used in js/ama.js for custom AMA questions —
  // update both files together so everything lands in one inbox.
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID";

  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (!form || !status) return;

  var isConfigured = FORMSPREE_ENDPOINT.indexOf("REPLACE_WITH_YOUR_FORM_ID") === -1;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var email = data.get("email");
    var subject = data.get("subject");
    var message = data.get("message");

    if (!email || !message) {
      status.textContent = "Please fill in your email and a message.";
      status.className = "form-status error";
      return;
    }

    if (!isConfigured) {
      // TODO(Sallee): form submissions can't be delivered until FORMSPREE_ENDPOINT
      // above is set to a real form ID from https://formspree.io.
      status.textContent = "Sorry, the contact form isn't fully set up yet — please check back soon.";
      status.className = "form-status error";
      return;
    }

    status.textContent = "Sending…";
    status.className = "form-status";

    fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data
    })
      .then(function (res) {
        if (res.ok) {
          status.textContent = "Thank you! Your message has been sent.";
          status.className = "form-status success";
          form.reset();
        } else {
          throw new Error("Request failed");
        }
      })
      .catch(function () {
        status.textContent = "Something went wrong — please try again in a moment.";
        status.className = "form-status error";
      });
  });
})();
