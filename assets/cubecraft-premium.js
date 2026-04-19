/**
 * CubeCraft Premium Theme - Scroll animations & interactions
 */

(function () {
  'use strict';

  // === SCROLL ANIMATIONS ===
  function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-cc-animate]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('cc-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  }

  // === HEADER SCROLL EFFECT ===
  function initHeaderScroll() {
    const header = document.querySelector('header, .header, header-component');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener(
      'scroll',
      () => {
        const current = window.scrollY;
        if (current > 60) {
          header.classList.add('site-header--scrolled');
        } else {
          header.classList.remove('site-header--scrolled');
        }
        lastScroll = current;
      },
      { passive: true }
    );
  }

  // === AUTO ANIMATE PAGE SECTIONS ===
  function autoAnimateSections() {
    const sections = document.querySelectorAll(
      'section, .section, [class*="section__"], [class*="hero"], [class*="featured"], [class*="collection"]'
    );

    sections.forEach((section) => {
      const children = section.querySelectorAll(
        'h1, h2, h3, p, .button, .card, [class*="card"], [class*="product"]'
      );

      children.forEach((child, i) => {
        if (!child.closest('[data-cc-animate]') && !child.hasAttribute('data-cc-animate')) {
          child.setAttribute('data-cc-animate', '');
          if (i < 5) child.setAttribute('data-delay', String(i + 1));
        }
      });
    });
  }

  // === FAQ ACCORDION ===
  function initFaq() {
    document.querySelectorAll('.cc-faq-item').forEach((item) => {
      const question = item.querySelector('.cc-faq-question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // close all
        document.querySelectorAll('.cc-faq-item.open').forEach((el) => el.classList.remove('open'));
        // toggle current
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  // === COUNTDOWN TIMER ===
  function initCountdown() {
    const countdowns = document.querySelectorAll('[data-cc-countdown]');
    if (!countdowns.length) return;

    countdowns.forEach((el) => {
      const endTime = new Date(el.dataset.ccCountdown);

      function update() {
        const now = new Date();
        const diff = endTime - now;
        if (diff <= 0) {
          el.textContent = 'Offre expirée';
          return;
        }

        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        const hEl = el.querySelector('[data-unit="h"]');
        const mEl = el.querySelector('[data-unit="m"]');
        const sEl = el.querySelector('[data-unit="s"]');

        if (hEl) hEl.textContent = String(h).padStart(2, '0');
        if (mEl) mEl.textContent = String(m).padStart(2, '0');
        if (sEl) sEl.textContent = String(s).padStart(2, '0');

        setTimeout(update, 1000);
      }

      update();
    });
  }

  // === STICKY CTA PULSE ===
  function initCtaPulse() {
    const ctaBtns = document.querySelectorAll('.button--primary, [class*="add-to-cart"]');
    ctaBtns.forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        btn.style.animation = 'ccPulse 0.6s ease';
      });
      btn.addEventListener('animationend', () => {
        btn.style.animation = '';
      });
    });
  }

  // === SMOOTH NUMBER COUNTERS ===
  function initCounters() {
    const counters = document.querySelectorAll('[data-cc-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          const target = parseInt(entry.target.dataset.ccCounter, 10);
          const duration = 1500;
          const start = performance.now();

          function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            entry.target.textContent = Math.round(eased * target).toLocaleString('fr-FR');
            if (progress < 1) requestAnimationFrame(step);
          }

          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  // === INIT ===
  function init() {
    initScrollAnimations();
    initHeaderScroll();
    initFaq();
    initCountdown();
    initCtaPulse();
    initCounters();

    // Auto-animate after a tiny delay so Shopify sections are rendered
    setTimeout(autoAnimateSections, 100);
    setTimeout(initScrollAnimations, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
