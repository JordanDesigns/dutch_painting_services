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
        if (!link.parentElement.classList.contains('has-dropdown')) {
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

  /* ----- Contact Form (Formspree AJAX submit) ----- */
  var contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = contactForm.querySelector('.form-submit');
      var errorEl = document.getElementById('formError');
      var successEl = document.getElementById('formSuccess');
      var originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

      if (errorEl) errorEl.hidden = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          contactForm.reset();
          contactForm.hidden = true;
          if (successEl) successEl.hidden = false;
        } else {
          throw new Error('Submission failed');
        }
      }).catch(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
        if (errorEl) errorEl.hidden = false;
      });
    });
  }

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

  /* ----- Project Modal / Lightbox (Desktop Only) ----- */
  var modal = document.getElementById('projectModal');

  if (modal && window.innerWidth > 768) {
    var modalOverlay = modal.querySelector('.project-modal-overlay');
    var modalClose = modal.querySelector('.modal-close');
    var modalImageArea = modal.querySelector('.modal-image-area');
    var modalTitle = modal.querySelector('.modal-info h3');
    var modalDesc = modal.querySelector('.modal-info .modal-desc');
    var modalLocation = modal.querySelector('.modal-info .modal-location');
    var modalTags = modal.querySelector('.modal-info .project-tags');

    function openModal(data) {
      if (window.innerWidth <= 768) return;

      modalTitle.textContent = data.title || '';
      modalDesc.textContent = data.description || '';

      if (data.location) {
        modalLocation.textContent = data.location;
        modalLocation.style.display = 'block';
      } else {
        modalLocation.style.display = 'none';
      }

      if (data.tags && data.tags.length > 0) {
        modalTags.innerHTML = '';
        data.tags.forEach(function (tag) {
          var span = document.createElement('span');
          span.className = 'project-tag';
          span.textContent = tag;
          modalTags.appendChild(span);
        });
        modalTags.style.display = 'flex';
      } else {
        modalTags.style.display = 'none';
      }

      if (data.type === 'before-after') {
        var beforeInner = data.beforeImage
          ? '<img src="' + data.beforeImage + '" alt="Before">'
          : '<span class="gallery-placeholder">Before Photo</span>';
        var afterInner = data.afterImage
          ? '<img src="' + data.afterImage + '" alt="After">'
          : '<span class="gallery-placeholder">After Photo</span>';
        modalImageArea.innerHTML = '<div class="modal-ba-images">' +
          '<div class="ba-image before"><span class="ba-label">Before</span>' +
          beforeInner + '</div>' +
          '<div class="ba-image after"><span class="ba-label">After</span>' +
          afterInner + '</div></div>';
      } else if (data.image) {
        modalImageArea.innerHTML = '<img src="' + data.image + '" alt="' + (data.title || 'Project') + '">';
      } else {
        modalImageArea.innerHTML = '<span class="gallery-placeholder">Project Photo</span>';
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    /* Bind gallery items */
    document.querySelectorAll('.gallery-item').forEach(function (item) {
      item.style.cursor = 'pointer';
      item.addEventListener('click', function () {
        var overlayEl = item.querySelector('.gallery-item-overlay');
        var title = overlayEl ? overlayEl.querySelector('h4') : null;
        var desc = overlayEl ? overlayEl.querySelector('p') : null;
        var galleryImg = item.querySelector('img');
        openModal({
          type: 'gallery',
          title: title ? title.textContent : 'Project',
          location: desc ? desc.textContent : '',
          image: galleryImg ? galleryImg.getAttribute('src') : '',
          description: 'A completed project by Dutch Painting Services showcasing our commitment to quality craftsmanship and attention to detail.',
          tags: []
        });
      });
    });

    /* Bind before/after items */
    document.querySelectorAll('.before-after-item').forEach(function (item) {
      item.style.cursor = 'pointer';
      item.addEventListener('click', function () {
        var infoEl = item.querySelector('.before-after-info');
        var title = infoEl ? infoEl.querySelector('h4') : null;
        var desc = infoEl ? infoEl.querySelector('p') : null;
        var tagEls = infoEl ? infoEl.querySelectorAll('.project-tag') : [];
        var tags = [];
        tagEls.forEach(function (t) { tags.push(t.textContent); });
        var beforeImg = item.querySelector('.ba-image.before img');
        var afterImg = item.querySelector('.ba-image.after img');
        openModal({
          type: 'before-after',
          title: title ? title.textContent : 'Project',
          description: desc ? desc.textContent : '',
          location: '',
          beforeImage: beforeImg ? beforeImg.getAttribute('src') : '',
          afterImage: afterImg ? afterImg.getAttribute('src') : '',
          tags: tags
        });
      });
    });
  }

});
