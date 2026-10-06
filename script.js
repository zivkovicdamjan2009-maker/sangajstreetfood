(function () {
  var OPEN = ["ROŠTILJ JE VRUĆ", "KUĆICA RADI", "AUTO JE NA PUTU", "DOSTAVA U INĐIJI", "GLADAN? DOĐI"];
  var SHUT = ["ZATVORENO ZA SADA", "ROŠTILJ SE HLADI", "SUTRA OD 09:00", "ČUVAJ APETIT", "VIDIMO SE"];
  var STAR = "\u00a0 \u2605 \u00a0";

  function isOpenNow() {
    var n = new Date(), d = n.getDay(), m = n.getHours() * 60 + n.getMinutes();
    if (d === 0) return m >= 960 && m < 1380;
    if (d === 5 || d === 6) return m >= 540;
    return m >= 540 && m < 1380;
  }

  function paintStatus() {
    var bar = document.getElementById("statusbar");
    var label = document.getElementById("statusLabel");
    var mq = document.getElementById("marquee");
    if (!bar || !mq) return;
    var open = isOpenNow();
    bar.classList.toggle("closed", !open);
    label.textContent = open ? "Sada otvoreno" : "Sada zatvoreno";
    var text = (open ? OPEN : SHUT).join(STAR) + STAR;
    var spans = mq.querySelectorAll("span");
    spans[0].textContent = text;
    spans[1].textContent = text;
  }

  var io = null;
  function scan() {
    var els = document.querySelectorAll("[data-reveal]:not(.sg-in)");
    for (var i = 0; i < els.length; i++) {
      var el = els[i], r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top < window.innerHeight * 0.9) {
        el.style.animationDelay = "0s";
        el.classList.add("sg-in");
        if (io) io.unobserve(el);
      } else if (io) {
        io.observe(el);
      }
    }
  }

  function initReveal() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach(function (el) { el.classList.add("sg-in"); });
      return;
    }
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var sibs = Array.prototype.slice.call(el.parentNode ? el.parentNode.children : []);
        el.style.animationDelay = Math.min(Math.max(0, sibs.indexOf(el)), 6) * 0.07 + "s";
        el.classList.add("sg-in");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    scan();
    var t = setInterval(function () {
      scan();
      if (!document.querySelector("[data-reveal]:not(.sg-in)")) clearInterval(t);
    }, 1200);
  }

  var bar = null;
  function progress() {
    if (!bar) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, (window.scrollY || window.pageYOffset) / max)) : 0;
    bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
  }
  function initProgress() {
    bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    progress();
  }

  function parallax() {
    var hero = document.getElementById("pocetna"), v = document.getElementById("heroVideo");
    if (!hero || !v) return;
    var h = hero.offsetHeight || 1;
    var p = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / h));
    v.style.transform = "scale(" + (1 + p * 0.16).toFixed(3) + ") translateY(" + (p * 6).toFixed(2) + "%)";
    v.style.filter = "brightness(" + (1 - p * 0.4).toFixed(3) + ")";
  }

  function initTabs() {
    var tabs = document.querySelectorAll(".tab");
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        if (t.classList.contains("is-active")) return;
        tabs.forEach(function (x) { x.classList.remove("is-active"); x.setAttribute("aria-selected", "false"); });
        t.classList.add("is-active");
        t.setAttribute("aria-selected", "true");
        var pick = t.getAttribute("data-tab");
        ["klopa", "sosevi", "pice"].forEach(function (k) {
          var p = document.getElementById("panel-" + k);
          if (!p) return;
          p.hidden = k !== pick;
          if (k === pick) {
            p.classList.remove("panel-in");
            void p.offsetWidth;
            p.classList.add("panel-in");
          }
        });
        scan();
      });
    });
  }

  function initDrawer() {
    var drawer = document.getElementById("drawer");
    var open = document.getElementById("burger");
    var close = document.getElementById("drawerClose");
    if (!drawer || !open) return;
    function set(on) {
      drawer.classList.toggle("is-open", on);
      drawer.setAttribute("aria-hidden", on ? "false" : "true");
      document.body.style.overflow = on ? "hidden" : "";
    }
    open.addEventListener("click", function () { set(true); });
    if (close) close.addEventListener("click", function () { set(false); });
    drawer.querySelectorAll(".drawer-nav a, .drawer-cta").forEach(function (a) {
      a.addEventListener("click", function () { set(false); });
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  }

  function initVideo() {
    var v = document.getElementById("heroVideo");
    if (!v) return;
    v.muted = true;
    var go = function () { var p = v.play(); if (p && p.catch) p.catch(function () {}); };
    if (v.readyState >= 2) go(); else v.addEventListener("loadeddata", go, { once: true });
  }

  function onScroll() {
    if (onScroll.raf) return;
    onScroll.raf = requestAnimationFrame(function () {
      onScroll.raf = null;
      parallax();
      scan();
      checkOrder();
      progress();
    });
  }

  var mOrderOn = false;
  function setOrder(on) {
    var b = document.getElementById("mOrder");
    if (!b || on === mOrderOn) return;
    mOrderOn = on;
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-hidden", on ? "false" : "true");
    b.tabIndex = on ? 0 : -1;
    document.body.classList.toggle("has-m-order", on);
  }
  function checkOrder() {
    var hero = document.getElementById("pocetna");
    if (!hero) return;
    var y = window.scrollY || window.pageYOffset;
    var heroEnd = hero.offsetTop + hero.offsetHeight - window.innerHeight * 0.35;
    if (!mOrderOn && y > heroEnd) setOrder(true);
    else if (mOrderOn && y < 60) setOrder(false);
  }
  function initOrder() {
    document.querySelectorAll('a[href="#pocetna"]').forEach(function (a) {
      a.addEventListener("click", function () { setOrder(false); });
    });
    checkOrder();
  }

  document.addEventListener("DOMContentLoaded", function () {
    paintStatus();
    setInterval(paintStatus, 60000);
    initVideo();
    initTabs();
    initDrawer();
    initReveal();
    initOrder();
    initProgress();
    parallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    var pre = document.getElementById("preloader");
    if (pre) setTimeout(function () { if (pre.parentNode) pre.parentNode.removeChild(pre); }, 1700);
  });
})();
