'use strict';

document.addEventListener('DOMContentLoaded', () => {
  triggerHeroReveal();
  revealOnScroll();
  initNavScrollSpy();
  initSmoothScroll();
  initContactForm();
  animateBars();
});

/* ═══ 1. HERO REVEAL on load ═══ */
function triggerHeroReveal() {
  document.querySelectorAll('.hero [data-reveal]').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 80 + i * 120);
  });
}

/* ═══ 2. SCROLL REVEAL ═══ */
function revealOnScroll() {
  const els = document.querySelectorAll('[data-reveal]:not(.visible)');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

/* ═══ 3. PROGRESS BARS ═══ */
function animateBars() {
  const fills = document.querySelectorAll('.sbar-fill[data-pct]');
  if (!fills.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const pct = el.getAttribute('data-pct');
      if (!pct) return;
      setTimeout(() => { el.style.width = pct + '%'; }, 300);
      io.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px' });

  fills.forEach(fill => {
    fill.style.width = '0%';
    io.observe(fill);
  });

  setTimeout(() => {
    fills.forEach(fill => {
      if (fill.style.width === '0%' || fill.style.width === '') {
        const rect = fill.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          fill.style.width = fill.getAttribute('data-pct') + '%';
        }
      }
    });
  }, 500);
}

/* ═══ 4. NAV SCROLL SPY ═══ */
function initNavScrollSpy() {
  const navItems = document.querySelectorAll('.nav-item[data-section]');
  const sections = Array.from(document.querySelectorAll('section[id]'));
  if (!navItems.length || !sections.length) return;

  function setActive() {
    const mid = window.scrollY + window.innerHeight / 2;
    let current = sections[0];
    sections.forEach(sec => {
      if (sec.offsetTop <= mid) current = sec;
    });
    navItems.forEach(item =>
      item.classList.toggle('active', item.dataset.section === current.id)
    );
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

/* ═══ 5. SMOOTH SCROLL ═══ */
function initSmoothScroll() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

/* ═══ 6. CONTACT FORM ═══ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('.cf-send');
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
      }, 2600);
    }, 1000);
  });

  form.querySelectorAll('.cf-input').forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.cf-group').style.transform = 'translateX(3px)';
    });
    input.addEventListener('blur', () => {
      input.closest('.cf-group').style.transform = '';
    });
  });
}
