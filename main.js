/* ============================================================
   MEDICA PRIME — MAIN JAVASCRIPT
   ============================================================ */

/* ── CONFIG ─────────────────────────────────────────────── */
const CONFIG = {
  // ✏️ Change these to your real values
  WHATSAPP_NUMBER: "919876543210",        // Country code + number, no +
  WHATSAPP_MESSAGE: "Hello! I'd like to book an appointment at Medica Prime with Dr. Aanya Sharma. Please let me know the available slots. Thank you!",
  EMAIL_ADDRESS: "appointments@medicaprime.in",
  EMAIL_SUBJECT: "Appointment Request – Medica Prime",
  CLINIC_OPEN_HOUR: 8,   // 8 AM
  CLINIC_CLOSE_HOUR: 21, // 9 PM (Mon–Fri)
  CLINIC_SAT_CLOSE: 18,  // 6 PM (Sat)
};

/* ── DOM READY ───────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initLucide();
  initTheme();
  initNavbar();
  initMobileMenu();
  initRevealAnimations();
  initCounters();
  initTestimonials();
  initFAQ();
  initCTALinks();
  initClinicHours();
  initScrollTop();
  initSmoothScroll();
  initHeroReveal();
  initActiveNavLink();
});

/* ── LUCIDE ICONS ────────────────────────────────────────── */
function initLucide() {
  if (window.lucide) lucide.createIcons();
}

/* ── THEME (LIGHT / DARK) ────────────────────────────────── */
function initTheme() {
  const toggle = document.getElementById("themeToggle");
  const html = document.documentElement;
  const stored = localStorage.getItem("medicaTheme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const setTheme = (theme) => {
    html.setAttribute("data-theme", theme);
    localStorage.setItem("medicaTheme", theme);
  };

  setTheme(stored || (systemDark ? "dark" : "light"));

  toggle?.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  });
}

/* ── NAVBAR SCROLL ───────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById("navbar");
  const onScroll = () => {
    nav?.classList.toggle("scrolled", window.scrollY > 60);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ── MOBILE MENU ─────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (!hamburger || !navLinks) return;

  const toggle = () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  const close = () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  hamburger.addEventListener("click", toggle);

  navLinks.querySelectorAll(".nav-link").forEach((link) =>
    link.addEventListener("click", close)
  );

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("open") &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      close();
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* ── REVEAL ANIMATIONS (IntersectionObserver) ─────────────── */
function initRevealAnimations() {
  const elements = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const siblings = Array.from(
            entry.target.parentElement?.children || []
          ).filter((el) =>
            el.classList.contains("reveal-up") ||
            el.classList.contains("reveal-left") ||
            el.classList.contains("reveal-right")
          );
          const idx = siblings.indexOf(entry.target);
          const delay = idx * 80;

          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ── HERO SECTION REVEAL ─────────────────────────────────── */
function initHeroReveal() {
  const items = document.querySelectorAll(".hero-content .reveal-up");
  items.forEach((el, i) => {
    setTimeout(() => {
      el.style.transition = "opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1)";
      el.classList.add("is-visible");
    }, 200 + i * 150);
  });
}

/* ── COUNTER ANIMATION ───────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll(".stat-number[data-count]");

  const formatNumber = (n, max) => {
    if (max >= 1000) return n.toLocaleString("en-IN");
    return n.toString();
  };

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(eased * target);
      el.textContent = formatNumber(current, target);

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatNumber(target, target);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* ── TESTIMONIALS SLIDER ─────────────────────────────────── */
function initTestimonials() {
  const inner = document.getElementById("testimonialsInner");
  const track = document.getElementById("testimonialsTrack");
  const prevBtn = document.getElementById("testiPrev");
  const nextBtn = document.getElementById("testiNext");
  const dotsContainer = document.getElementById("testiDots");

  if (!inner || !track) return;

  const cards = Array.from(inner.children);
  const total = cards.length;
  let current = 0;
  let isDragging = false;
  let startX = 0;
  let startTranslate = 0;
  let autoplayTimer;

  // Responsive: how many cards visible
  const getVisible = () => (window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3);

  // Build dots
  const buildDots = () => {
    dotsContainer.innerHTML = "";
    const pages = Math.ceil(total / getVisible());
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement("button");
      dot.className = `testi-dot${i === 0 ? " active" : ""}`;
      dot.setAttribute("aria-label", `Go to page ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  };

  const updateDots = () => {
    const dots = dotsContainer.querySelectorAll(".testi-dot");
    const page = Math.floor(current / getVisible());
    dots.forEach((d, i) => d.classList.toggle("active", i === page));
  };

  const getCardWidth = () => {
    const gap = 20; // matches CSS gap: 1.25rem
    const visCount = getVisible();
    const totalGap = gap * (visCount - 1);
    return (track.offsetWidth - totalGap) / visCount;
  };

  const getTranslate = (idx) => {
    const cw = getCardWidth() + 20;
    return -(idx * cw);
  };

  const goTo = (idx) => {
    const maxIdx = total - getVisible();
    current = Math.max(0, Math.min(idx, maxIdx));
    inner.style.transform = `translateX(${getTranslate(current)}px)`;
    updateDots();
  };

  const next = () => goTo(current + getVisible());
  const prev = () => goTo(current - getVisible());

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      if (current + getVisible() >= total) goTo(0);
      else next();
    }, 5000);
  };

  const stopAutoplay = () => clearInterval(autoplayTimer);

  nextBtn?.addEventListener("click", () => { next(); startAutoplay(); });
  prevBtn?.addEventListener("click", () => { prev(); startAutoplay(); });

  // Touch / drag
  const getEventX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  track.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = getEventX(e);
    startTranslate = getTranslate(current);
    inner.style.transition = "none";
    stopAutoplay();
  });

  track.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = getEventX(e);
    startTranslate = getTranslate(current);
    inner.style.transition = "none";
    stopAutoplay();
  }, { passive: true });

  const onMove = (e) => {
    if (!isDragging) return;
    const delta = getEventX(e) - startX;
    inner.style.transform = `translateX(${startTranslate + delta}px)`;
  };

  const onEnd = (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = startX - endX;
    inner.style.transition = "";

    if (Math.abs(diff) > 50) {
      if (diff > 0) next(); else prev();
    } else {
      goTo(current);
    }
    startAutoplay();
  };

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);
  track.addEventListener("touchmove", onMove, { passive: true });
  track.addEventListener("touchend", onEnd);

  // Init
  buildDots();
  window.addEventListener("resize", () => { buildDots(); goTo(current); });
  startAutoplay();
}

/* ── FAQ ACCORDION ───────────────────────────────────────── */
function initFAQ() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all
      items.forEach((i) => {
        i.classList.remove("open");
        i.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
      });

      // Open clicked if was closed
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ── CTA LINKS (WhatsApp + Email) ────────────────────────── */
function initCTALinks() {
  const waUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(CONFIG.WHATSAPP_MESSAGE)}`;
  const emailUrl = `mailto:${CONFIG.EMAIL_ADDRESS}?subject=${encodeURIComponent(CONFIG.EMAIL_SUBJECT)}`;

  const waButtons = document.querySelectorAll("#heroBookBtn, #whatsappBookBtn");
  const emailButtons = document.querySelectorAll("#heroContactBtn, #emailContactBtn");

  waButtons.forEach((btn) => {
    btn.href = waUrl;
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
  });

  emailButtons.forEach((btn) => {
    btn.href = emailUrl;
  });
}

/* ── CLINIC HOURS STATUS ─────────────────────────────────── */
function initClinicHours() {
  const badge = document.getElementById("openBadge");
  const status = document.getElementById("openStatus");
  if (!badge || !status) return;

  const now = new Date();
  const day = now.getDay(); // 0=Sun,1=Mon,...,6=Sat
  const hour = now.getHours();

  let isOpen = false;

  if (day >= 1 && day <= 5) {
    // Mon–Fri: 8am–9pm
    isOpen = hour >= CONFIG.CLINIC_OPEN_HOUR && hour < CONFIG.CLINIC_CLOSE_HOUR;
  } else if (day === 6) {
    // Sat: 8am–6pm
    isOpen = hour >= CONFIG.CLINIC_OPEN_HOUR && hour < CONFIG.CLINIC_SAT_CLOSE;
  }

  if (isOpen) {
    status.textContent = "Open Now";
    badge.style.color = "var(--clr-success)";
    badge.querySelector(".open-dot").style.background = "var(--clr-success)";
  } else {
    status.textContent = "Currently Closed";
    badge.style.color = "var(--clr-text-3)";
    const dot = badge.querySelector(".open-dot");
    if (dot) dot.style.background = "var(--clr-text-3)";
  }
}

/* ── SCROLL TO TOP ───────────────────────────────────────── */
function initScrollTop() {
  const btn = document.getElementById("scrollTop");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("visible", window.scrollY > 600),
    { passive: true }
  );

  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

/* ── SMOOTH SCROLL (for same-page anchors) ───────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById("navbar")?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* ── ACTIVE NAV LINK on scroll ───────────────────────────── */
function initActiveNavLink() {
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ── GSAP PARALLAX (if GSAP loaded) ─────────────────────── */
window.addEventListener("load", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Hero video subtle parallax
    gsap.to(".hero-video", {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Stats section entrance
    gsap.fromTo(
      ".stat-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 80%",
        },
      }
    );

    // Service cards subtle scale on hover reinforcement via GSAP
    document.querySelectorAll(".service-card").forEach((card) => {
      card.addEventListener("mouseenter", () =>
        gsap.to(card.querySelector(".service-icon-wrap"), {
          rotation: -8,
          scale: 1.15,
          duration: 0.3,
          ease: "power2.out",
        })
      );
      card.addEventListener("mouseleave", () =>
        gsap.to(card.querySelector(".service-icon-wrap"), {
          rotation: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.inOut",
        })
      );
    });
  }
});