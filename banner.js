(function () {
  var DUR = 7000;
  var slides = [
    { img: "./assets/banner-ministry.jpg", alt: "Ministry of Mines and Minerals, Republic of Botswana",
      eyebrow: "Republic of Botswana · MME",
      title: 'A Ministry of <em>Mines and Minerals</em> Investment' },
    { img: "./assets/banner-pula-to-purpose.jpg", alt: "Pula to Purpose",
      eyebrow: "A Botswana project",
      title: 'Pula <em>to</em> Purpose',
      lede: "A project based on what the rough diamond has endured — to a shining legacy in the ethos of the development of Botswana." }
  ];
  var arrowL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
  var arrowR = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };

  function build() {
    var el = document.createElement("section");
    el.className = "mci-banner";
    el.setAttribute("aria-roledescription", "carousel");
    el.setAttribute("aria-label", "Featured highlights");
    el.style.setProperty("--mci-dur", DUR + "ms");
    el.innerHTML =
      '<div class="mci-banner__stage" aria-live="off">' +
      slides.map(function (s, i) {
        return '<article class="mci-slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' of ' + slides.length + '">' +
          '<div class="mci-slide__media"><img src="' + s.img + '" alt="' + s.alt + '"' + (i ? ' loading="lazy"' : '') + '></div>' +
          '<div class="mci-slide__copy"><p class="mci-eyebrow eyebrow">' + s.eyebrow + '</p><h2>' + s.title + '</h2>' +
          (s.lede ? '<p class="mci-lede">' + s.lede + '</p>' : '') + '</div></article>';
      }).join("") +
      '<div class="mci-controls"><div class="mci-controls__in">' +
      '<div class="mci-dots">' + slides.map(function (_, i) { return '<button class="mci-dot" type="button" aria-label="Go to slide ' + (i + 1) + '"><i></i></button>'; }).join("") + '</div>' +
      '<span class="mci-count"></span>' +
      '<div class="mci-arrows"><button class="mci-arrow" data-d="-1" type="button" aria-label="Previous slide">' + arrowL + '</button>' +
      '<button class="mci-arrow" data-d="1" type="button" aria-label="Next slide">' + arrowR + '</button></div>' +
      '</div></div></div>';

    var items = el.querySelectorAll(".mci-slide"), dots = el.querySelectorAll(".mci-dot"), count = el.querySelector(".mci-count");
    var cur = -1, timer;
    function go(n) {
      n = (n + slides.length) % slides.length;
      items.forEach(function (s, i) { s.classList.toggle("is-active", i === n); });
      dots.forEach(function (d, i) { d.classList.remove("is-active"); if (i === n) { void d.offsetWidth; d.classList.add("is-active"); } });
      count.textContent = pad(n + 1) + " / " + pad(slides.length);
      cur = n; restart();
    }
    function restart() { clearTimeout(timer); if (!el.classList.contains("is-paused")) timer = setTimeout(function () { go(cur + 1); }, DUR); }
    el.querySelectorAll(".mci-arrow").forEach(function (b) { b.addEventListener("click", function () { go(cur + +b.dataset.d); }); });
    dots.forEach(function (d, i) { d.addEventListener("click", function () { go(i); }); });
    function pause() { el.classList.add("is-paused"); clearTimeout(timer); }
    function resume() { el.classList.remove("is-paused"); go(cur); }
    el.addEventListener("mouseenter", pause); el.addEventListener("mouseleave", resume);
    el.addEventListener("focusin", pause); el.addEventListener("focusout", resume);
    el.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") go(cur + 1); if (e.key === "ArrowLeft") go(cur - 1); });
    document.addEventListener("visibilitychange", function () { document.hidden ? clearTimeout(timer) : restart(); });
    go(0);
    return el;
  }

  function inject() {
    var main = document.querySelector("main");
    if (!main || !main.firstElementChild) return false;
    if (!document.querySelector(".mci-banner")) main.firstElementChild.after(build());
    var f = document.querySelector("footer");
    if (f && !f.querySelector(".mci-credit")) {
      var c = document.createElement("p");
      c.className = "mci-credit";
      c.innerHTML = "Developed by <strong>i Centric Technologies</strong> in partnership with <strong>Summit Organization</strong>";
      (f.firstElementChild || f).after(c);
    }
    return !!document.querySelector(".mci-banner") && !!(f && f.querySelector(".mci-credit"));
  }
  function start() {
    if (inject()) return;
    var mo = new MutationObserver(function () { if (inject()) mo.disconnect(); });
    mo.observe(document.body, { childList: true, subtree: true });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
})();
