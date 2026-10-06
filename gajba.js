(function () {
  var form = document.getElementById("upit");
  if (!form) return;
  var btn = document.getElementById("upitBtn");
  var status = document.getElementById("upitStatus");
  var date = document.getElementById("upitDatum");
  if (date) {
    var t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
    date.min = t.toISOString().slice(0, 10);
  }
  function show(msg, isErr) {
    status.hidden = false;
    status.textContent = msg;
    status.classList.toggle("is-error", !!isErr);
  }
  form.addEventListener("submit", function (e) {
    if (!window.fetch || !window.URLSearchParams) return; // native submit fallback
    e.preventDefault();
    if (!form.reportValidity()) return;
    var data = new FormData(form);
    if (data.get("bot-field")) return;
    btn.disabled = true;
    var label = btn.textContent;
    btn.textContent = "Šaljem…";
    status.hidden = true;
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data).toString()
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      window.location.href = form.getAttribute("action");
    }).catch(function () {
      btn.disabled = false;
      btn.textContent = label;
      show("Upit nije poslat. Proveri internet vezu i pokušaj ponovo.", true);
    });
  });
})();
