const reveals = document.querySelectorAll('.reveal');
const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
  const updateHeader = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach((element) => revealObserver.observe(element));

document.querySelectorAll('[data-hero-slideshow]').forEach((slideshow) => {
  const slides = [...slideshow.querySelectorAll('.hero-slide')];
  let activeIndex = 0;

  if (slides.length > 1) {
    window.setInterval(() => {
      slides[activeIndex].classList.remove('is-active');
      activeIndex = (activeIndex + 1) % slides.length;
      slides[activeIndex].classList.add('is-active');
    }, 3000);
  }
});

document.querySelectorAll('[data-doctor-slideshow]').forEach((slideshow) => {
  const slides = [...slideshow.querySelectorAll('.doctor-portrait-slide')];
  let activeIndex = 0;

  if (slides.length > 1) {
    window.setInterval(() => {
      slides[activeIndex].classList.remove('is-active');
      activeIndex = (activeIndex + 1) % slides.length;
      slides[activeIndex].classList.add('is-active');
    }, 3000);
  }
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (menuToggle && mobileMenu) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '打开菜单');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.classList.remove('is-open');
    siteHeader?.classList.remove('menu-open');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? '打开菜单' : '关闭菜单');
    mobileMenu.setAttribute('aria-hidden', String(isOpen));
    mobileMenu.classList.toggle('is-open', !isOpen);
    siteHeader?.classList.toggle('menu-open', !isOpen);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
}
