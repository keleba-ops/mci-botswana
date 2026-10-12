(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  /* ---- scroll progress, header state, back-to-top ---- */
  function chrome() {
    var bar = document.createElement("div");
    bar.className = "mci-progress"; bar.setAttribute("aria-hidden", "true");
    var top = document.createElement("button");
    top.type = "button"; top.className = "mci-top"; top.setAttribute("aria-label", "Back to top");
    top.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>';
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
    document.body.appendChild(bar); document.body.appendChild(top);
    var ticking = false;
    function frame() {
      ticking = false;
      var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0).toFixed(4) + ")";
      root.classList.toggle("mci-scrolled", y > 60);
      top.classList.toggle("is-on", y > 700);
      timeline();
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
    window.addEventListener("resize", frame);
    frame();
  }

  /* ---- timeline: gold spine draws with scroll, dots light up ---- */
  function timeline() {
    var tl = document.querySelector(".timeline-rule");
    if (!tl) return;
    var r = tl.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.max(0, Math.min(1, (vh * 0.62 - r.top) / (r.height || 1)));
    tl.style.setProperty("--tl", p.toFixed(3));
    tl.querySelectorAll("article").forEach(function (a) {
      var d = a.querySelector(".timeline-dot");
      if (d) a.classList.toggle("mci-lit", d.getBoundingClientRect().top < vh * 0.62);
    });
  }

  /* ---- reveal-on-scroll for everything below the carousel ---- */
  var REVEAL = ".eyebrow,h2,h3,article,.texture-frame,.arrow-link,.pt-2>p,.pt-3>div,#audience .border-t>div,#gathering .grid>p,section>div>div>p";
  function reveals() {
    if (reduce || !("IntersectionObserver" in window)) return;
    var secs = [].slice.call(document.querySelectorAll("main>section")).slice(2);
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    secs.forEach(function (s) {
      var seen = new Set();
      s.querySelectorAll(REVEAL).forEach(function (el) {
        if (seen.has(el) || el.closest(".mci-cta-fx")) return;
        seen.add(el);
        var sib = el.parentElement ? [].indexOf.call(el.parentElement.children, el) : 0;
        el.style.setProperty("--rd", Math.min(sib, 5) * 90 + "ms");
        el.classList.add("mci-rv");
        io.observe(el);
      });
    });
  }

  /* ---- gold diamond ornaments on section seams ---- */
  function ornaments() {
    var secs = [].slice.call(document.querySelectorAll("main>section")).slice(2);
    var io = "IntersectionObserver" in window ? new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 1 }) : null;
    secs.forEach(function (s) {
      if (s.previousElementSibling && s.previousElementSibling.classList.contains("mci-orn")) return;
      var o = document.createElement("div");
      o.className = "mci-orn"; o.setAttribute("aria-hidden", "true"); o.innerHTML = "<i></i>";
      s.before(o);
      if (io && !reduce) io.observe(o); else o.classList.add("in");
    });
  }

  /* ---- closing section: same aurora + faint diamond as the slides ---- */
  function cta() {
    var secs = document.querySelectorAll("main>section"), s = secs[secs.length - 1];
    if (!s || s.querySelector(".mci-cta-fx") || !window.__MCI_GEM) return false;
    var fx = document.createElement("div");
    fx.className = "mci-cta-fx"; fx.setAttribute("aria-hidden", "true");
    fx.innerHTML = '<span class="mci-aurora"></span>' + window.__MCI_GEM
      .replace(/id="mciG"/, 'id="mciG2"').replace(/url\(#mciG\)/g, "url(#mciG2)")
      .replace(/id="mciS"/, 'id="mciS2"').replace(/url\(#mciS\)/g, "url(#mciS2)");
    var content = s.querySelector(".relative.mx-auto") || s.lastElementChild;
    s.insertBefore(fx, content);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { fx.classList.toggle("in", en[0].isIntersecting); }, { threshold: 0.15 }).observe(s);
    } else fx.classList.add("in");
    return true;
  }

  /* ---- highlight the nav link of the section on screen ---- */
  function navSpy() {
    if (!("IntersectionObserver" in window)) return;
    var links = {};
    document.querySelectorAll('a.nav-link[href^="#"]').forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var ids = Object.keys(links);
    if (!ids.length) return;
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (links[e.target.id]) links[e.target.id].classList.toggle("mci-active", e.isIntersecting); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    ids.forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  var ran = {};
  function tryAll() {
    var ready = document.querySelector("main>section:nth-child(8)") && document.querySelector("footer") && document.querySelector(".mci-countdown");
    if (!ready) return false;
    if (!ran.chrome) { ran.chrome = 1; chrome(); }
    if (!ran.rv) { ran.rv = 1; reveals(); ornaments(); navSpy(); }
    if (!ran.cta) ran.cta = cta();
    return ran.cta;
  }
  function start() {
    if (tryAll()) return;
    var mo = new MutationObserver(function () { if (tryAll()) mo.disconnect(); });
    mo.observe(document.body, { childList: true, subtree: true });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
})();
