(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Barra de progresso global */
  function initScrollProgress() {
    var bar = document.getElementById("scroll-progress__bar");
    if (!bar) return;

    function update() {
      var doc = document.documentElement;
      var scrollTop = window.scrollY || doc.scrollTop;
      var height = doc.scrollHeight - doc.clientHeight;
      var p = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = p + "%";
      bar.setAttribute("aria-valuenow", Math.round(p));
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* Intersection Observer — scroll triggers */
  function initScrollTriggers() {
    if (reduceMotion) {
      document.querySelectorAll("[data-scroll]").forEach(function (el) {
        el.classList.add("is-inview");
      });
      return;
    }

    var els = document.querySelectorAll("[data-scroll]");
    if (!els.length) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-inview");
          if (entry.target.dataset.scrollOnce !== "false") {
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    els.forEach(function (el) {
      io.observe(el);
    });
  }

  /* Escalonar filhos [data-scroll] */
  function initStagger() {
    if (reduceMotion) return;
    document.querySelectorAll("[data-scroll-stagger]").forEach(function (parent) {
      var step = parseInt(parent.dataset.staggerMs || "90", 10);
      var children = parent.querySelectorAll(":scope > [data-scroll]");
      children.forEach(function (child, i) {
        child.style.setProperty("--reveal-delay", i * step + "ms");
      });
    });
  }

  /* Hero: parallax simples na imagem de fundo */
  function initHeroParallax() {
    var img = document.querySelector(".hero-parallax-img");
    if (!img || reduceMotion) return;

    function tick() {
      var y = window.scrollY * 0.22;
      img.style.setProperty("--parallax-y", y.toFixed(1) + "px");
    }

    var raf = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!raf) {
          raf = true;
          requestAnimationFrame(function () {
            raf = false;
            tick();
          });
        }
      },
      { passive: true }
    );
    tick();
  }

  /* Sobre: leve parallax no fundo */
  function initAboutParallax() {
    var bg = document.querySelector(".about-parallax-bg");
    if (!bg || reduceMotion) return;

    function tick() {
      var section = bg.closest("section");
      if (!section) return;
      var top = section.getBoundingClientRect().top + window.scrollY;
      var y = (window.scrollY - top) * 0.18;
      bg.style.transform = "translate3d(0, " + y.toFixed(1) + "px, 0) scale(1.06)";
    }

    var raf = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!raf) {
          raf = true;
          requestAnimationFrame(function () {
            raf = false;
            tick();
          });
        }
      },
      { passive: true }
    );
    tick();
  }

  function boot() {
    initScrollProgress();
    initStagger();
    initScrollTriggers();
    initHeroParallax();
    initAboutParallax();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
