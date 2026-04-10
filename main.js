/* =========================================================
   Le Réveil Bastille — JavaScript principal
   Navigation sticky, sélecteur langue, FAQ, animations scroll
   ========================================================= */

(function () {
  "use strict";

  /* -------- Navigation : effet scroll + menu mobile -------- */
  const nav = document.querySelector(".nav");
  const burger = document.querySelector(".nav-burger");

  const handleScroll = () => {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Menu burger mobile
  if (burger) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("open");
      const expanded = nav.classList.contains("open");
      burger.setAttribute("aria-expanded", expanded);
      document.body.style.overflow = expanded ? "hidden" : "";
    });
    // Fermer le menu après clic sur un lien
    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* -------- Sélecteur de langue (dropdown) -------- */
  const langSwitcher = document.querySelector(".lang-switcher");
  if (langSwitcher) {
    const trigger = langSwitcher.querySelector(".lang-current");
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      langSwitcher.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!langSwitcher.contains(e.target)) langSwitcher.classList.remove("open");
    });
    // Fermer au scroll pour éviter dropdown perdu
    window.addEventListener("scroll", () => langSwitcher.classList.remove("open"), { passive: true });
  }

  /* -------- FAQ accordéon -------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-q");
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      // Ferme tous les autres pour un comportement accordéon classique
      document.querySelectorAll(".faq-item.open").forEach((other) => {
        if (other !== item) other.classList.remove("open");
      });
      item.classList.toggle("open", !isOpen);
      question.setAttribute("aria-expanded", !isOpen);
    });
  });

  /* -------- Animations au scroll (IntersectionObserver) -------- */
  // Sélecteur unique pour fade-in, stagger, reveal-left/right, img-reveal
  const revealElements = document.querySelectorAll(
    ".fade-in, .stagger, .reveal-left, .reveal-right, .img-reveal"
  );
  if ("IntersectionObserver" in window && revealElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -80px 0px" }
    );
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  /* -------- Parallax hero — image de fond translatée au scroll -------- */
  const heroBgImg = document.querySelector(".hero-bg img");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroBgImg && !prefersReduced) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          // Translation douce + zoom léger inverse
          if (y < window.innerHeight) {
            heroBgImg.style.transform = `translateY(${y * 0.35}px) scale(${1.05 + y * 0.0002})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -------- Scroll progress bar -------- */
  const progress = document.querySelector(".scroll-progress");
  if (progress) {
    const updateProgress = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (scrolled / max) * 100 : 0;
      progress.style.width = pct + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  /* -------- Hero h1 — split en mots animés (reveal stagger) -------- */
  const heroH1 = document.querySelector(".hero h1");
  if (heroH1 && !prefersReduced) {
    // On split chaque enfant texte (en gardant le span.script-accent intact)
    heroH1.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const frag = document.createDocumentFragment();
        const words = node.textContent.trim().split(/\s+/);
        words.forEach((w, i) => {
          const wrap = document.createElement("span");
          wrap.className = "word";
          const inner = document.createElement("span");
          inner.textContent = w;
          inner.style.animationDelay = (0.25 + i * 0.08) + "s";
          wrap.appendChild(inner);
          frag.appendChild(wrap);
          frag.appendChild(document.createTextNode(" "));
        });
        node.parentNode.replaceChild(frag, node);
      }
    });
  }

  /* -------- Année dynamique footer -------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------- Smooth scroll pour ancres internes -------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });
})();
