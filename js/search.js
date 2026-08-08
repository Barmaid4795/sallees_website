(function () {
  "use strict";

  var openBtns = document.querySelectorAll(".search-open");
  var overlay = document.getElementById("search-overlay");
  var input = document.getElementById("search-input");
  var resultsList = document.getElementById("search-results");
  var closeBtn = document.querySelector(".search-close");
  if (!overlay || !input || !resultsList) return;

  var index = [];
  document.querySelectorAll("[data-search-title]").forEach(function (el) {
    index.push({
      title: el.getAttribute("data-search-title") || "",
      medium: el.getAttribute("data-search-medium") || "",
      project: el.getAttribute("data-search-project") || "",
      keywords: el.getAttribute("data-search-keywords") || "",
      targetId: el.id
    });
  });

  function openSearch() {
    overlay.classList.add("open");
    input.value = "";
    renderResults("");
    setTimeout(function () { input.focus(); }, 30);
    document.body.style.overflow = "hidden";
  }
  function closeSearch() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  openBtns.forEach(function (btn) { btn.addEventListener("click", openSearch); });
  closeBtn && closeBtn.addEventListener("click", closeSearch);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeSearch();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeSearch();
    if ((e.key === "/" || (e.ctrlKey && e.key.toLowerCase() === "k")) &&
        document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      e.preventDefault();
      openSearch();
    }
  });

  function renderResults(query) {
    var q = query.trim().toLowerCase();
    resultsList.innerHTML = "";

    var matches = index.filter(function (item) {
      if (!q) return false;
      var haystack = (item.title + " " + item.medium + " " + item.project + " " + item.keywords).toLowerCase();
      return haystack.indexOf(q) !== -1;
    });

    if (!q) {
      var hint = document.createElement("li");
      hint.className = "search-empty";
      hint.textContent = "Search by title, medium, project name, or keyword…";
      resultsList.appendChild(hint);
      return;
    }

    if (!matches.length) {
      var empty = document.createElement("li");
      empty.className = "search-empty";
      empty.textContent = "No matches for “" + query + "”.";
      resultsList.appendChild(empty);
      return;
    }

    matches.forEach(function (item) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + item.targetId;
      a.innerHTML = item.title + '<span class="result-meta">' +
        [item.medium, item.project].filter(Boolean).join(" · ") + "</span>";
      a.addEventListener("click", function () {
        closeSearch();
        var target = document.getElementById(item.targetId);
        if (target) {
          setTimeout(function () {
            target.classList.add("search-highlight");
            setTimeout(function () { target.classList.remove("search-highlight"); }, 1600);
          }, 350);
        }
      });
      li.appendChild(a);
      resultsList.appendChild(li);
    });
  }

  input.addEventListener("input", function () { renderResults(input.value); });
})();
