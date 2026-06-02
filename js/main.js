/* ============================================================
   Dutch Painting Services — Main JavaScript
   Lightweight vanilla JS — no dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ----- Header Scroll Effect ----- */
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ----- Mobile Menu ----- */
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const overlay = document.querySelector('.mobile-overlay');

  function openMobileMenu() {
    mobileToggle.classList.add('active');
    mainNav.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileToggle.classList.remove('active');
    mainNav.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', function () {
      if (mainNav.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMobileMenu);
  }

  /* Close mobile menu when a link is clicked */
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        /* Don't close if it's the Services dropdown trigger */
        if (!link.parentElement.classList.contains('has-dropdown') ||
            link.getAttribute('href') !== '#') {
          closeMobileMenu();
        }
      }
    });
  });

  /* ----- Mobile Dropdown Toggle ----- */
  const dropdownParents = document.querySelectorAll('.has-dropdown');
  dropdownParents.forEach(function (item) {
    const trigger = item.querySelector(':scope > a');
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });
  });

  /* ----- Scroll Reveal (Intersection Observer) ----- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    /* Fallback: show everything */
    revealElements.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  /* ----- Testimonial Slider ----- */
  const sliderTrack = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    if (!sliderTrack || slides.length === 0) return;
    currentSlide = index;
    sliderTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  if (slides.length > 0) {
    /* Dot navigation */
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToSlide(i);
        resetAutoSlide();
      });
    });

    /* Auto-advance */
    function startAutoSlide() {
      slideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
      clearInterval(slideInterval);
      startAutoSlide();
    }

    startAutoSlide();
  }

  /* ----- Photo Slideshow ----- */
  const slideshows = document.querySelectorAll('.slideshow');

  slideshows.forEach(function (slideshow) {
    const track = slideshow.querySelector('.slideshow-track');
    const slideshowSlides = slideshow.querySelectorAll('.slideshow-slide');
    const prevBtn = slideshow.querySelector('.slideshow-prev');
    const nextBtn = slideshow.querySelector('.slideshow-next');
    let currentIndex = 0;
    let autoInterval;

    function goTo(index) {
      if (slideshowSlides.length === 0) return;
      currentIndex = ((index % slideshowSlides.length) + slideshowSlides.length) % slideshowSlides.length;
      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goTo(currentIndex - 1);
        resetAuto();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goTo(currentIndex + 1);
        resetAuto();
      });
    }

    function startAuto() {
      autoInterval = setInterval(function () {
        goTo(currentIndex + 1);
      }, 4000);
    }

    function resetAuto() {
      clearInterval(autoInterval);
      startAuto();
    }

    if (slideshowSlides.length > 1) {
      startAuto();
    }
  });

  /* ----- Smooth scroll for anchor links ----- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----- Active nav link highlighting ----- */
  var currentPath = window.location.pathname;
  var navAnchors = document.querySelectorAll('.main-nav > ul > li > a');

  navAnchors.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPath || href === currentPath + '/' ||
        (currentPath.startsWith('/services/') && href === '/services/')) {
      link.classList.add('active');
    }
  });

});
