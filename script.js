/* ─── STACK Landing Page ─── */

document.addEventListener('DOMContentLoaded', () => {

  /* ═══ Navbar scroll effect ═══ */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ═══ Mobile menu toggle ═══ */
  const toggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('active');
    navLinks.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });

  /* ═══ Smooth scroll ═══ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ═══ Intersection Observer — fade-in ═══ */
  const faders = document.querySelectorAll('.fade-in, .section-tag, .section-title, .section-subtitle, .contact-wrapper');
  const observerOpts = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOpts);

  faders.forEach(el => fadeObserver.observe(el));

  /* ═══ Contact form validation ═══ */
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset errors
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    let valid = true;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const role = form.role.value;
    const message = form.message.value.trim();

    if (!name) { markError('name'); valid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { markError('email'); valid = false; }
    if (!role) { markError('role'); valid = false; }
    if (!message) { markError('message'); valid = false; }

    if (!valid) return;

    // Show toast
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);

    form.reset();
  });

  function markError(fieldId) {
    document.getElementById(fieldId).closest('.form-group').classList.add('error');
  }

  /* ═══ Hero parallax-lite on scroll ═══ */
  const hero = document.getElementById('hero');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      hero.style.setProperty('--parallax-y', `${y * 0.35}px`);
    }
  }, { passive: true });
});
