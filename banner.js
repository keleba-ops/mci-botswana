(function () {
  var DUR = 8000;
  var layers = [
    { img: "./assets/banner-ministry.jpg", alt: "Ministry of Mines and Minerals, Republic of Botswana",
      eyebrow: "Republic of Botswana · MME", ghost: "MME",
      title: "A Ministry of <em>Mines and Minerals</em> Investment" },
    { img: "./assets/banner-pula-to-purpose.jpg", alt: "Pula to Purpose",
      eyebrow: "A Botswana project", ghost: "PULA",
      title: "Pula <em>to</em> Purpose",
      lede: "A project based on what the rough diamond has endured — to a shining legacy in the ethos of the development of Botswana." }
  ];
  /* Slide order: Ministry, the original hero (null = no layer), Pula to Purpose */
  var SEQ = [0, null, 1];
  var TOTAL = SEQ.length;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var arrowL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
  var arrowR = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };


  var GEM = '<svg class="mci-gem" viewBox="0 0 400 400" fill="none" aria-hidden="true">' +
    '<defs><linearGradient id="mciG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1dc"/><stop offset="1" stop-color="#e0b68f"/></linearGradient><linearGradient id="mciS" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fd8ff"/><stop offset=".5" stop-color="#fff1dc"/><stop offset="1" stop-color="#d6b3ff"/></linearGradient></defs>' +
    '<g class="mci-gem__fill"><path d="M140 60L200 60L170 150Z"/><path d="M200 60L260 60L230 150Z"/><path d="M60 150L140 60L170 150Z"/><path d="M340 150L260 60L230 150Z"/><path d="M170 150L230 150L200 350Z"/></g><g class="mci-gem__fire"><path d="M60 150L140 60L170 150Z"/><path d="M340 150L260 60L230 150Z"/><path d="M170 150L200 350L60 150Z"/><path d="M230 150L340 150L200 350Z"/></g>' +
    '<g class="mci-gem__lines" stroke="url(#mciG)" stroke-width="1.2" stroke-linejoin="round">' +
    '<path pathLength="1" style="--k:0" d="M60 150L140 60L260 60L340 150L200 350Z"/>' +
    '<path pathLength="1" style="--k:1" d="M60 150L340 150"/>' +
    '<path pathLength="1" style="--k:2" d="M140 60L170 150L200 350"/>' +
    '<path pathLength="1" style="--k:3" d="M260 60L230 150L200 350"/>' +
    '<path pathLength="1" style="--k:4" d="M200 60L170 150M200 60L230 150M170 150L230 150"/>' +
    '</g><g class="mci-gem__glint"><path d="M140 60l6 14 14 6-14 6-6 14-6-14-14-6 14-6z"/><path d="M300 190l4 9 9 4-9 4-4 9-4-9-9-4 9-4z"/><path d="M215 250l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></g></svg>';

  function wordify(html) {
    var n = 0, em = false, out = "";
    html.split(/(<em>|<\/em>)/).forEach(function (seg) {
      if (seg === "<em>") em = true;
      else if (seg === "</em>") em = false;
      else seg.split(/\s+/).filter(Boolean).forEach(function (w) {
        out += '<span class="w' + (em ? " em" : "") + '"><i style="--i:' + (n++) + '">' + w + "</i></span> ";
      });
    });
    return out;
  }

  function build(hero) {
    hero.classList.add("mci-hero");
    hero.setAttribute("aria-roledescription", "carousel");
    hero.style.setProperty("--mci-dur", DUR + "ms");

    var els = layers.map(function (s, i) {
      var a = document.createElement("div");
      a.className = "mci-layer";
      a.setAttribute("role", "group");
      a.setAttribute("aria-roledescription", "slide");
      a.setAttribute("aria-label", s.alt);
      a.innerHTML =
        '<div class="mci-bg" aria-hidden="true"><span class="mci-aurora"></span>' + GEM + '<span class="mci-ghost">' + s.ghost + '</span></div>' +
        '<div class="mci-layer__media"><img src="' + s.img + '" alt="' + s.alt + '"' + (i ? ' loading="lazy"' : "") + '><span class="mci-sweep"></span><span class="mci-frame"></span></div>' +
        '<div class="mci-layer__copy"><p class="mci-eyebrow eyebrow"><span>' + s.eyebrow + "</span></p><h2>" + wordify(s.title) + "</h2>" +
        (s.lede ? '<p class="mci-lede">' + s.lede + "</p>" : '<i class="mci-rule"></i>') + "</div>";
      hero.appendChild(a);
      return a;
    });

    /* ambient gold dust */
    if (!reduce) {
      var dust = document.createElement("div");
      dust.className = "mci-dust";
      dust.setAttribute("aria-hidden", "true");
      for (var k = 0; k < 18; k++) {
        var sp = document.createElement("span");
        sp.style.cssText = "left:" + ((k * 53 + 7) % 100) + "%;--s:" + (3 + (k * 7) % 6) + "px;--d:" + (11 + (k * 5) % 9) + "s;--dl:-" + ((k * 3) % 14) + "s;--x:" + (((k * 37) % 120) - 60) + "px";
        dust.appendChild(sp);
      }
      hero.appendChild(dust);
    }

    /* drifting faceted diamonds + twinkling sparkles */
    if (!reduce) {
      var gems = document.createElement("div");
      gems.className = "mci-gems";
      gems.setAttribute("aria-hidden", "true");
      for (var g = 0; g < 9; g++) {
        var el = document.createElement("span");
        el.className = "g";
        el.style.cssText = "left:" + ((g * 41 + 11) % 92) + "%;--s:" + (12 + (g * 5) % 16) + "px;--d:" + (16 + (g * 3) % 10) + "s;--dl:-" + ((g * 4) % 18) + "s;--x:" + (((g * 29) % 140) - 70) + "px;--r:" + (3 + (g % 4)) + "s";
        el.innerHTML = "<i></i>";
        gems.appendChild(el);
      }
      for (var q = 0; q < 14; q++) {
        var st = document.createElement("span");
        st.className = "st";
        st.style.cssText = "left:" + ((q * 37 + 5) % 96) + "%;top:" + ((q * 23 + 9) % 82 + 6) + "%;--s:" + (10 + (q * 3) % 12) + "px;--dl:" + ((q * 7) % 11) / 2 + "s;--d:" + (3 + (q % 4)) + "s";
        gems.appendChild(st);
      }
      hero.appendChild(gems);
    }

    var c = document.createElement("div");
    c.className = "mci-controls";
    var dots = "";
    for (var i = 0; i < TOTAL; i++) dots += '<button class="mci-dot" type="button" aria-label="Go to slide ' + (i + 1) + '"><i></i></button>';
    c.innerHTML = '<div class="mci-controls__in"><div class="mci-dots">' + dots + '</div><span class="mci-count" aria-live="off"></span>' +
      '<div class="mci-arrows"><button class="mci-arrow" data-d="-1" type="button" aria-label="Previous slide">' + arrowL + "</button>" +
      '<button class="mci-arrow" data-d="1" type="button" aria-label="Next slide">' + arrowR + "</button></div></div>";
    hero.appendChild(c);

    /* gentle pointer parallax */
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      hero.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });

    var dotEls = c.querySelectorAll(".mci-dot"), count = c.querySelector(".mci-count"), cur = -1, timer, first = true;

    function replayHero() {
      hero.classList.remove("mci-on");
      var rv = hero.querySelectorAll(".reveal");
      rv.forEach(function (n) { n.classList.remove("reveal"); });
      void hero.offsetWidth;
      rv.forEach(function (n) { n.classList.add("reveal"); });
      hero.classList.add("mci-on");
    }

    function go(n) {
      n = (n + TOTAL) % TOTAL;
      var which = SEQ[n];
      els.forEach(function (e, i) {
        var was = e.classList.contains("is-active");
        if (i === which) {
          e.classList.remove("is-leaving");
          if (first) e.classList.add("no-wipe");
          e.classList.add("is-active");
          if (first) { void e.offsetWidth; e.classList.remove("no-wipe"); }
        } else {
          e.classList.remove("is-active");
          e.classList.toggle("is-leaving", was);
        }
      });
      if (which === null) replayHero(); else hero.classList.remove("mci-on");
      dotEls.forEach(function (d, i) { d.classList.remove("is-active"); if (i === n) { void d.offsetWidth; d.classList.add("is-active"); } });
      count.innerHTML = "<b>" + pad(n + 1) + "</b> / " + pad(TOTAL);
      cur = n; first = false; restart();
    }
    function restart() { clearTimeout(timer); if (!hero.classList.contains("is-paused")) timer = setTimeout(function () { go(cur + 1); }, DUR); }
    c.querySelectorAll(".mci-arrow").forEach(function (b) { b.addEventListener("click", function () { go(cur + +b.dataset.d); }); });
    dotEls.forEach(function (d, i) { d.addEventListener("click", function () { go(i); }); });
    function pause() { hero.classList.add("is-paused"); clearTimeout(timer); }
    function resume() { hero.classList.remove("is-paused"); restart(); }
    hero.addEventListener("mouseenter", pause); hero.addEventListener("mouseleave", resume);
    hero.addEventListener("focusin", pause); hero.addEventListener("focusout", resume);
    hero.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") go(cur + 1); if (e.key === "ArrowLeft") go(cur - 1); });
    document.addEventListener("visibilitychange", function () { document.hidden ? clearTimeout(timer) : restart(); });
    go(0);
  }

  function inject() {
    var hero = document.querySelector("main>section");
    var f = document.querySelector("footer");
    if (!hero || !f) return false;
    if (!hero.classList.contains("mci-hero")) build(hero);
    if (!f.querySelector(".mci-credit")) {
      var p = document.createElement("p");
      p.className = "mci-credit";
      p.innerHTML = "Developed by <strong>i Centric Technologies</strong> in partnership with <strong>Summit Organization</strong>";
      (f.firstElementChild || f).after(p);
    }
    return true;
  }
  function start() {
    if (inject()) return;
    var mo = new MutationObserver(function () { if (inject()) mo.disconnect(); });
    mo.observe(document.body, { childList: true, subtree: true });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
})();
