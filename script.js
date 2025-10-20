// Year auto-insert
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Sticky header shadow on scroll
(function(){
  const header = document.querySelector('.site-header');
  const setShadow = () => {
    if (!header) return;
    const scrolled = window.scrollY > 2;
    header.classList.toggle('header-shadow', scrolled);
  };
  setShadow();
  window.addEventListener('scroll', setShadow, {passive:true});
})();

// Mobile burger toggle
(function(){
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (!burger || !nav) return;

  const closeNav = () => {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded','false');
  };

  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });

  // Close on link click (mobile)
  nav.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => closeNav());
  });

  // Close on outside click (mobile)
  document.addEventListener('click', (e) => {
    if (window.matchMedia('(min-width: 860px)').matches) return;
    if (!nav.contains(e.target) && e.target !== burger && !burger.contains(e.target)) {
      closeNav();
    }
  });
})();

// Smooth scroll for internal links with focus management
(function(){
  const headerOffset = () => {
    const header = document.querySelector('.site-header');
    return header ? header.offsetHeight + 8 : 0;
  };

  const scrollToHash = (hash, updateHistory = true) => {
    const target = document.querySelector(hash);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
    window.scrollTo({ top, behavior: 'smooth' });
    target.setAttribute('tabindex','-1');
    target.focus({ preventScroll: true });
    if (updateHistory) history.pushState(null, '', hash);
    setTimeout(() => target.removeAttribute('tabindex'), 400);
  };

  // Click links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (hash && hash.length > 1) {
        e.preventDefault();
        scrollToHash(hash);
      }
    });
  });

  // Handle direct hash on load
  window.addEventListener('load', () => {
    if (location.hash && document.querySelector(location.hash)) {
      setTimeout(() => scrollToHash(location.hash, false), 0);
    }
  });
})();

// Active menu highlight on scroll (IntersectionObserver)
(function(){
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const sectionIds = navLinks.map(a => a.getAttribute('href')).filter(Boolean);
  const sections = sectionIds.map(id => document.querySelector(id)).filter(Boolean);
  if (!sections.length) return;

  const setActive = (id) => {
    navLinks.forEach(a => {
      const match = a.getAttribute('href') === id;
      a.classList.toggle('active', match);
      if (match) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
  };

  // Observer with rootMargin to account for header
  const header = document.querySelector('.site-header');
  const headerH = header ? header.offsetHeight : 64;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = `#${entry.target.id}`;
      if (entry.isIntersecting) setActive(id);
    });
  }, {
    root: null,
    rootMargin: `-${Math.max(0, headerH + 10)}px 0px -60% 0px`,
    threshold: 0.1
  });

  sections.forEach(sec => observer.observe(sec));
})();
