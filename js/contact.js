(function () {
  "use strict";

  // TODO(Sallee): replace with your real Formspree endpoint, e.g.
  // "https://formspree.io/f/abcdwxyz" — create a free form at https://formspree.io
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID";
  var CONTACT_EMAIL = "salleeschaerer@gmail.com";

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
      // Fallback until a real Formspree form ID is added: open the visitor's email client.
      var mailto = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject || "Message from your website") +
        "&body=" + encodeURIComponent(message + "\n\nFrom: " + email);
      window.location.href = mailto;
      status.textContent = "Opening your email app to send this message (in-site sending isn't wired up yet).";
      status.className = "form-status";
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
        status.textContent = "Something went wrong — please email " + CONTACT_EMAIL + " directly.";
        status.className = "form-status error";
      });
  });
})();
