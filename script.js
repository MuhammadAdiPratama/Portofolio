'use strict';

/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  revealOnScroll();
  animateBars();
  initNavSpy();
  initNavSticky();
  initSmoothScroll();
  initContactForm();
  triggerHeroReveal();
});

/* ═══════════════════════════════════════
   1. SCROLL REVEAL
═══════════════════════════════════════ */
function revealOnScroll() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
}

/* hero elements reveal on load */
function triggerHeroReveal() {
  const heroEls = document.querySelectorAll('.hero [data-reveal]');
  setTimeout(() => {
    heroEls.forEach(el => el.classList.add('visible'));
  }, 100);
}

/* ═══════════════════════════════════════
   2. PROGRESS BARS
═══════════════════════════════════════ */
function animateBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pct = entry.target.getAttribute('data-pct');
        // small delay for visual polish
        setTimeout(() => {
          entry.target.style.width = pct + '%';
        }, 180);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  fills.forEach(f => io.observe(f));
}

/* ═══════════════════════════════════════
   3. NAV ACTIVE SCROLL SPY
═══════════════════════════════════════ */
function initNavSpy() {
  const navItems = document.querySelectorAll('.nav-item[data-section]');
  const sections = Array.from(document.querySelectorAll('section[id]'));
  if (!navItems.length || !sections.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(item => {
          item.classList.toggle('active', item.dataset.section === id);
        });
      }
    });
  }, {
    threshold: 0,
    rootMargin: '-40% 0px -40% 0px'
  });

  sections.forEach(sec => io.observe(sec));

  // click active
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

/* ═══════════════════════════════════════
   4. NAVBAR: sticky fixed after hero
═══════════════════════════════════════ */
function initNavSticky() {
  const nav  = document.getElementById('floatnav');
  const hero = document.querySelector('.hero');
  if (!nav || !hero) return;

  // We clone the nav into body so it can be fixed
  const clone = nav.cloneNode(true);
  clone.id = 'floatnav-fixed';
  clone.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    opacity: 0;
    pointer-events: none;
    transition: opacity .3s ease;
  `;
  document.body.appendChild(clone);

  // Sync active class from original to clone
  function syncActive() {
    const origActives = nav.querySelectorAll('.nav-item.active');
    clone.querySelectorAll('.nav-item').forEach((ci, i) => {
      const orig = nav.querySelectorAll('.nav-item')[i];
      ci.classList.toggle('active', orig && orig.classList.contains('active'));
    });
  }

  // Click on clone → click original logic
  clone.querySelectorAll('.nav-item').forEach((ci, i) => {
    ci.addEventListener('click', () => {
      clone.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      nav.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      ci.classList.add('active');
      nav.querySelectorAll('.nav-item')[i].classList.add('active');
    });
  });

  // Observer: show fixed nav when hero exits viewport
  const heroObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      clone.style.opacity = '1';
      clone.style.pointerEvents = 'auto';
    } else {
      clone.style.opacity = '0';
      clone.style.pointerEvents = 'none';
    }
  }, { threshold: 0 });

  heroObserver.observe(hero);

  // keep active synced
  const mo = new MutationObserver(syncActive);
  mo.observe(nav, { attributes: true, subtree: true, attributeFilter: ['class'] });
}

/* ═══════════════════════════════════════
   5. SMOOTH SCROLL
═══════════════════════════════════════ */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const id = anchor.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 20;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════
   6. CONTACT FORM
═══════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.cf-send');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Sent!';
      btn.style.background = '#16a34a';
      form.reset();
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 2800);
    }, 1100);
  });

  // focus glow shift
  form.querySelectorAll('.cf-input').forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.cf-group').style.transform = 'translateX(3px)';
    });
    input.addEventListener('blur', () => {
      input.closest('.cf-group').style.transform = '';
    });
  });
}
