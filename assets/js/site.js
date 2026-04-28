const btn = document.getElementById('menu-btn');
const menu = document.getElementById('mobile-menu');
const icon = document.getElementById('menu-icon');
const PATHS_MENU = '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>';
const PATHS_X = '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';

btn?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  if (icon) icon.innerHTML = open ? PATHS_X : PATHS_MENU;
});

const obs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach((el) => obs.observe(el));
