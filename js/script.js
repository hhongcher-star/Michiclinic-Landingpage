const reveals = document.querySelectorAll('.reveal');
const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
  let isHeaderScrolled = null;
  const updateHeader = () => {
    const nextState = window.scrollY > 12;
    if (nextState === isHeaderScrolled) return;
    isHeaderScrolled = nextState;
    siteHeader.classList.toggle('is-scrolled', nextState);
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

document.querySelectorAll('[data-scroll-autoplay]').forEach((video) => {
  const autoplayObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, { threshold: 0.45 });

  autoplayObserver.observe(video);
});

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

const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwhU8DKN6VwziPEAcJjFxcyN7Tl9q9_V6Gx67xiloD1uC-RDXhptK-ZMUN8A0FhT-UwLA/exec';
const bookingModal = document.querySelector('[data-booking-modal]');
const bookingForm = document.querySelector('[data-booking-form]');
const bookingStatus = document.querySelector('[data-booking-status]');
const bookingName = document.querySelector('#booking-name');

if (bookingModal && bookingForm && bookingStatus) {
  const openBooking = () => {
    bookingModal.classList.add('is-open');
    bookingModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('booking-open');
    window.setTimeout(() => bookingName?.focus(), 120);
  };

  const closeBooking = () => {
    bookingModal.classList.remove('is-open');
    bookingModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('booking-open');
  };

  document.querySelectorAll('[data-open-booking]').forEach((button) => {
    button.addEventListener('click', openBooking);
  });

  bookingModal.querySelectorAll('[data-close-booking]').forEach((button) => {
    button.addEventListener('click', closeBooking);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && bookingModal.classList.contains('is-open')) closeBooking();
  });

  bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;

    bookingStatus.className = 'booking-status';
    if (!GOOGLE_SHEET_WEB_APP_URL) {
      bookingStatus.textContent = '表格已准备好，创建 Google Sheet 后即可启用提交。';
      bookingStatus.classList.add('is-error');
      return;
    }

    const submitButton = bookingForm.querySelector('.booking-submit');
    const formData = new FormData(bookingForm);
    const customerName = String(formData.get('name') || '').trim();
    const customerPhone = String(formData.get('phone') || '').trim();
    const submissionData = new URLSearchParams({
      name: customerName,
      phone: customerPhone,
      submittedAt: new Date().toISOString()
    });
    submitButton.disabled = true;
    submitButton.textContent = '提交中…';
    bookingStatus.textContent = '';

    try {
      await fetch(GOOGLE_SHEET_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: submissionData.toString()
      });
      bookingForm.reset();
      bookingStatus.textContent = '资料已提交，正在打开 WhatsApp…';
      bookingStatus.classList.add('is-success');
      const whatsappMessage = '您好，我想预约 Dr Alice 的 RM888 Promo。';
      window.setTimeout(() => {
        window.location.href = `https://wa.me/60143912188?text=${encodeURIComponent(whatsappMessage)}`;
      }, 700);
    } catch (error) {
      bookingStatus.textContent = '暂时无法提交，请稍后再试或通过 WhatsApp 联系我们。';
      bookingStatus.classList.add('is-error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = '提交资料并前往 WhatsApp';
    }
  });
}
