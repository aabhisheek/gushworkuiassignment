/**
 * MANGALAM HDPE PIPES — SCRIPT.JS
 * =====================================================
 * Handles:
 *  1 — Sticky Header          — scroll shadow + hide on
 *      scroll-down / show on scroll-up
 *  2 — Mobile Navigation      — hamburger toggle,
 *      outside-click close
 *  3 — Smooth Scroll          — anchor links with
 *      sticky header offset
 *  4 — Product Gallery        — prev/next arrows +
 *      thumbnail click, touch/swipe
 *  5 — FAQ Accordion          — toggle open/close,
 *      aria-expanded sync
 *  6 — Process Tabs           — tabbed manufacturing
 *      step switcher
 *  7 — Applications Carousel  — prev/next + auto-play
 *      (pauses on hover)
 *  8 — Modal Dialogs          — open/close for
 *      #modal-quote and #modal-download, focus trap,
 *      Escape key, backdrop click
 *  9 — Gallery Zoom Lens      — side-panel magnifier,
 *      tablet tap-to-lightbox fallback
 * 10 — Form Handling          — validation + loading
 *      spinner + success state for all 4 forms
 * =====================================================
 */

(function () {
  'use strict';

  /* ─── UTILITY ─── */

  function throttle(fn, limit) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        fn.apply(this, args);
      }
    };
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  /* =====================================================
   * 1 — STICKY HEADER
   * ===================================================== */

  const siteHeader = document.getElementById('siteHeader');

  let lastScrollY    = window.scrollY;
  let headerVisible  = false;   // starts hidden (above fold)
  let wasBelowFold   = false;   // tracks first fold-crossing

  function updateHeader() {
    if (!siteHeader) return;
    const scrollY  = window.scrollY;
    const foldH    = window.innerHeight; // first fold = one full viewport height

    // Shadow (only meaningful when header is visible)
    siteHeader.classList.toggle('is-scrolled', scrollY > 8);

    if (scrollY < foldH) {
      // ── Above fold: always hidden ──
      siteHeader.classList.remove('is-visible');
      siteHeader.classList.remove('is-hidden');
      headerVisible = false;
      wasBelowFold  = false;
    } else {
      // ── Below fold: smart hide/show on scroll direction ──
      if (!wasBelowFold) {
        // First time crossing the fold → reveal header
        siteHeader.classList.add('is-visible');
        siteHeader.classList.remove('is-hidden');
        headerVisible = true;
        wasBelowFold  = true;
      } else if (scrollY > lastScrollY && headerVisible) {
        // Scrolling down → hide
        siteHeader.classList.add('is-hidden');
        headerVisible = false;
      } else if (scrollY < lastScrollY && !headerVisible) {
        // Scrolling up → show
        siteHeader.classList.remove('is-hidden');
        headerVisible = true;
      }
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', throttle(updateHeader, 80), { passive: true });
  updateHeader();

  /* =====================================================
   * 2 — MOBILE NAVIGATION
   * ===================================================== */

  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  let mobileOpen   = false;

  function openMobile() {
    mobileOpen = true;
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobile() {
    mobileOpen = false;
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      mobileOpen ? closeMobile() : openMobile();
    });
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (mobileOpen && siteHeader && !siteHeader.contains(e.target)) {
      closeMobile();
    }
  });

  // Close when a mobile nav link is clicked
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', closeMobile);
    });
  }

  /* =====================================================
   * 3 — SMOOTH SCROLL
   * ===================================================== */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href   = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeMobile();

      const headerH = siteHeader ? siteHeader.offsetHeight : 0;
      const offset  = headerH + 16;
      const targetY = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  /* =====================================================
   * 4 — PRODUCT GALLERY
   * ===================================================== */

  const galleryTrack = document.getElementById('galleryTrack');
  const galleryThumbs = document.getElementById('galleryThumbs');
  const btnPrev = document.getElementById('galleryPrev');
  const btnNext = document.getElementById('galleryNext');

  if (galleryTrack) {
    const slides  = Array.from(galleryTrack.querySelectorAll('.gallery-slide'));
    const thumbs  = galleryThumbs ? Array.from(galleryThumbs.querySelectorAll('.thumb')) : [];
    let current   = 0;

    function goToSlide(index) {
      current = clamp(index, 0, slides.length - 1);

      // Move the track
      const slideWidth = slides[0].offsetWidth;
      galleryTrack.style.transform = `translateX(-${current * slideWidth}px)`;

      // Update slide active class (used by zoom to find current image)
      slides.forEach((sl, i) => sl.classList.toggle('is-active', i === current));

      // Update thumb active state
      thumbs.forEach((th, i) => {
        const active = i === current;
        th.classList.toggle('is-active', active);
        th.setAttribute('aria-selected', String(active));
      });

      // Update prev/next disabled states
      if (btnPrev) btnPrev.disabled = current <= 0;
      if (btnNext) btnNext.disabled = current >= slides.length - 1;
    }

    // Arrow buttons
    if (btnPrev) btnPrev.addEventListener('click', () => goToSlide(current - 1));
    if (btnNext) btnNext.addEventListener('click', () => goToSlide(current + 1));

    // Thumbnail clicks
    thumbs.forEach((th) => {
      th.addEventListener('click', () => {
        const idx = parseInt(th.dataset.idx, 10);
        if (!isNaN(idx)) goToSlide(idx);
      });
    });

    // Keyboard navigation on gallery
    galleryTrack.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') goToSlide(current + 1);
      if (e.key === 'ArrowLeft')  goToSlide(current - 1);
    });

    // Touch / swipe
    let touchStartX = 0;
    let touchDeltaX = 0;

    galleryTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    }, { passive: true });

    galleryTrack.addEventListener('touchmove', (e) => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });

    galleryTrack.addEventListener('touchend', () => {
      if (Math.abs(touchDeltaX) > 50) {
        touchDeltaX < 0 ? goToSlide(current + 1) : goToSlide(current - 1);
      }
      touchDeltaX = 0;
    });

    // Recalculate on resize (item widths change)
    window.addEventListener('resize', throttle(() => {
      goToSlide(current); // re-apply transform with updated widths
    }, 200));

    // Init
    goToSlide(0);
  }

  /* =====================================================
   * 5 — FAQ ACCORDION
   * ===================================================== */

  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('is-open');

      // Close all open items first (single-open accordion)
      document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
        openItem.classList.remove('is-open');
        const openBtn = openItem.querySelector('.faq-btn');
        const openAns = openItem.querySelector('.faq-answer');
        if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
        if (openAns) openAns.hidden = true;
      });

      // Toggle the clicked item
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        if (answer) answer.hidden = false;
      }
    });
  });

  /* =====================================================
   * 6 — PROCESS TABS
   * ===================================================== */

  const procTabs   = document.querySelectorAll('.proc-tab');
  const procPanels = document.querySelectorAll('.proc-panel');

  procTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const step = tab.dataset.step;

      // Deactivate all tabs
      procTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });

      // Hide all panels
      procPanels.forEach(p => {
        p.classList.remove('is-active');
        p.hidden = true;
      });

      // Activate clicked tab
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      // Show matching panel
      const panel = document.querySelector(`.proc-panel[data-panel="${step}"]`);
      if (panel) {
        panel.hidden = false;
        panel.classList.add('is-active');
      }
    });
  });

  /* =====================================================
   * 7 — APPLICATIONS CAROUSEL
   * ===================================================== */

  const appsTrack = document.getElementById('appsTrack');
  const appPrev   = document.getElementById('appPrev');
  const appNext   = document.getElementById('appNext');

  if (appsTrack) {
    const appItems = Array.from(appsTrack.querySelectorAll('.app-card'));
    let appIndex   = 0;

    function getAppsVisible() {
      const vw = window.innerWidth;
      if (vw <= 480)  return 1;
      if (vw <= 768)  return 2;
      if (vw <= 1024) return 3;
      return 4;
    }

    function appsMaxIndex() {
      return Math.max(0, appItems.length - getAppsVisible());
    }

    function goToApp(index) {
      appIndex = clamp(index, 0, appsMaxIndex());

      const itemWidth = appItems[0] ? appItems[0].offsetWidth : 0;
      const gap       = parseFloat(getComputedStyle(appsTrack).gap) || 24;
      const offset    = appIndex * (itemWidth + gap);
      appsTrack.style.transform = `translateX(-${offset}px)`;

      if (appPrev) appPrev.disabled = appIndex <= 0;
      if (appNext) appNext.disabled = appIndex >= appsMaxIndex();
    }

    if (appPrev) appPrev.addEventListener('click', () => goToApp(appIndex - 1));
    if (appNext) appNext.addEventListener('click', () => goToApp(appIndex + 1));

    window.addEventListener('resize', throttle(() => {
      goToApp(0);
    }, 200));

    // Auto-play: advance every 4 s, pause on hover
    let appsTimer = setInterval(() => {
      const next = appIndex >= appsMaxIndex() ? 0 : appIndex + 1;
      goToApp(next);
    }, 4000);

    const appsWrap = appsTrack.closest('section') || appsTrack.parentElement;
    if (appsWrap) {
      appsWrap.addEventListener('mouseenter', () => clearInterval(appsTimer));
      appsWrap.addEventListener('mouseleave', () => {
        appsTimer = setInterval(() => {
          const next = appIndex >= appsMaxIndex() ? 0 : appIndex + 1;
          goToApp(next);
        }, 4000);
      });
    }

    goToApp(0);
  }

  /* =====================================================
   * 8 — MODAL DIALOGS
   * ===================================================== */

  /**
   * Open a modal by its element ID.
   * Removes the `hidden` attribute, adds `is-open` on the
   * next frame (to trigger CSS transition), traps focus inside.
   */
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Trigger transition on next frame
    requestAnimationFrame(() => {
      modal.classList.add('is-open');
    });

    // Focus the first focusable element inside the modal
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) {
      setTimeout(() => focusable[0].focus(), 60);
    }

    // Store the element that triggered the modal so we can return focus
    modal._triggerEl = document.activeElement;
  }

  /**
   * Close a modal by its element ID.
   */
  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Wait for CSS transition before re-adding hidden
    modal.addEventListener('transitionend', function handler(e) {
      if (e.target !== modal) return;
      modal.setAttribute('hidden', '');
      modal.removeEventListener('transitionend', handler);
    });

    // Return focus to the triggering element
    if (modal._triggerEl && typeof modal._triggerEl.focus === 'function') {
      modal._triggerEl.focus();
    }
  }

  // ── Wire up open triggers ──

  // Quote modal triggers
  ['heroQuoteBtn', 'featuresQuoteBtn', 'mobileQuoteBtn'].forEach(btnId => {
    const el = document.getElementById(btnId);
    if (el) el.addEventListener('click', () => openModal('modal-quote'));
  });

  // Download modal triggers
  ['specsDownloadBtn', 'dlInstall', 'dlMaintenance', 'dlSpecs'].forEach(btnId => {
    const el = document.getElementById(btnId);
    if (el) el.addEventListener('click', () => openModal('modal-download'));
  });

  // ── Wire up close buttons (data-close="modal-id") ──
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(btn.dataset.close);
    });
  });

  // ── Close on backdrop click (click outside the modal box) ──
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  // ── Close on Escape key ──
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal-backdrop.is-open').forEach(modal => {
      closeModal(modal.id);
    });
  });

  // ── Focus trap inside modals ──
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter(el => !el.closest('[hidden]'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  });

  /* =====================================================
   * 9 — GALLERY ZOOM LENS
   *
   * On hover over the main gallery image:
   *  - A small rectangular indicator box (.zoom-lens) tracks
   *    the cursor position on the image, showing which region
   *    will be magnified.
   *  - A large result panel (.zoom-result) appears to the right
   *    of the gallery column, showing the magnified portion.
   *
   * Tablet/hybrid fallback:
   *  - On pointer:coarse devices (tablets, stylus) a tap on the
   *    gallery image opens a full-screen lightbox with the
   *    zoomed image (.zoom-lightbox), dismissable by tap/Escape.
   * ===================================================== */

  const zoomLens     = document.getElementById('zoomLens');
  const zoomResult   = document.getElementById('zoomResult');
  const galleryViewport = document.getElementById('galleryViewport');

  if (zoomLens && galleryViewport && galleryTrack) {
    const ZOOM    = 2.5;   // magnification factor
    const LENS_W  = 120;   // indicator box width (px)
    const LENS_H  = 100;   // indicator box height (px)

    const isFinePonter  = () => window.matchMedia('(pointer: fine)').matches;
    const isCoarsePointer = () => window.matchMedia('(pointer: coarse)').matches;

    function getCurrentSlideImg() {
      const active = galleryTrack.querySelector('.gallery-slide.is-active');
      return active ? active.querySelector('img') : null;
    }

    function onGalleryMouseMove(e) {
      const img = getCurrentSlideImg();
      if (!img || !img.complete || !img.naturalWidth) return;

      const rect = galleryViewport.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // 1. Position the lens indicator box (clamped to gallery bounds)
      const lensX = clamp(x - LENS_W / 2, 0, rect.width  - LENS_W);
      const lensY = clamp(y - LENS_H / 2, 0, rect.height - LENS_H);
      zoomLens.style.left = `${lensX}px`;
      zoomLens.style.top  = `${lensY}px`;

      // 2. Update the side-panel zoom result
      if (zoomResult) {
        const resultW = zoomResult.offsetWidth  || 420;
        const resultH = zoomResult.offsetHeight || 315;

        const bgW = rect.width  * ZOOM;
        const bgH = rect.height * ZOOM;

        // Centre the zoomed region on the cursor position
        const bgX = -(x * ZOOM - resultW / 2);
        const bgY = -(y * ZOOM - resultH / 2);

        zoomResult.style.backgroundImage    = `url(${img.src})`;
        zoomResult.style.backgroundSize     = `${bgW}px ${bgH}px`;
        zoomResult.style.backgroundPosition = `${bgX}px ${bgY}px`;
      }
    }

    // ── Desktop (fine pointer): hover zoom ──
    galleryViewport.addEventListener('mouseenter', () => {
      if (!isFinePonter()) return;
      zoomLens.style.display = 'block';
      if (zoomResult) {
        zoomResult.style.display = 'block';
        requestAnimationFrame(() => zoomResult.classList.add('is-visible'));
      }
    });

    galleryViewport.addEventListener('mouseleave', () => {
      if (!isFinePonter()) return;
      zoomLens.style.display = 'none';
      if (zoomResult) {
        zoomResult.classList.remove('is-visible');
        setTimeout(() => { zoomResult.style.display = 'none'; }, 160);
      }
    });

    galleryViewport.addEventListener('mousemove', throttle(onGalleryMouseMove, 16), { passive: true });

    // ── Tablet / stylus (coarse pointer): tap-to-lightbox zoom ──
    // Create lightbox element once and reuse
    const lightbox = document.createElement('div');
    lightbox.className = 'zoom-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-label', 'Zoomed product image');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.innerHTML = '<img class="zoom-lightbox-img" src="" alt="Product zoom" /><button class="zoom-lightbox-close" aria-label="Close zoom">&times;</button>';
    document.body.appendChild(lightbox);

    const lightboxImg   = lightbox.querySelector('.zoom-lightbox-img');
    const lightboxClose = lightbox.querySelector('.zoom-lightbox-close');

    function openLightbox() {
      const img = getCurrentSlideImg();
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.setAttribute('hidden', '');
      lightbox.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => lightbox.classList.add('is-open'));
      lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => { lightbox.setAttribute('hidden', ''); }, 220);
      galleryViewport.focus();
    }

    galleryViewport.addEventListener('click', (e) => {
      if (!isCoarsePointer()) return;
      openLightbox();
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

  /* =====================================================
   * 10 — FORM HANDLING
   * ===================================================== */

  /**
   * Validate a form — checks required fields are non-empty
   * and that email fields look like emails.
   * Returns true if valid, false otherwise (also marks fields).
   */
  function validateForm(form) {
    let valid = true;
    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(el => el.remove());
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

    form.querySelectorAll('[required]').forEach(input => {
      const val = input.value.trim();
      if (!val) {
        markInvalid(input, 'This field is required.');
        valid = false;
      } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        markInvalid(input, 'Please enter a valid email address.');
        valid = false;
      }
    });

    return valid;
  }

  function markInvalid(input, message) {
    input.classList.add('is-invalid');
    const err = document.createElement('span');
    err.className = 'field-error';
    err.textContent = message;
    input.parentNode.insertBefore(err, input.nextSibling);
  }

  /**
   * Show a success message inside the form's parent container.
   */
  function showSuccess(form, message) {
    const wrap = form.closest('.mform-wrap') || form.parentNode;
    const successEl = document.createElement('div');
    successEl.className = 'form-success';
    successEl.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="#16A34A" stroke-width="2"/>
        <path d="M8 12l3 3 5-5" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>${message}</p>
    `;
    form.style.display = 'none';
    wrap.appendChild(successEl);
  }

  /**
   * Show a loading state on a submit button, then run callback after delay.
   */
  function withLoading(btn, originalText, delay, callback) {
    btn.textContent = 'Sending\u2026';
    btn.classList.add('btn-loading');
    btn.disabled = true;
    setTimeout(() => {
      btn.classList.remove('btn-loading');
      callback();
    }, delay);
  }

  // ── Quote Form ──
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(quoteForm)) return;
      const btn = quoteForm.querySelector('[type="submit"]');
      if (btn) {
        withLoading(btn, btn.textContent, 900, () => {
          showSuccess(quoteForm, 'Thank you! Our team will call you back within 24 hours.');
        });
      } else {
        showSuccess(quoteForm, 'Thank you! Our team will call you back within 24 hours.');
      }
    });
  }

  // ── Download / Catalogue Email Form ──
  const downloadForm = document.getElementById('downloadForm');
  if (downloadForm) {
    downloadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(downloadForm)) return;
      const btn = downloadForm.querySelector('[type="submit"]');
      if (btn) {
        withLoading(btn, btn.textContent, 900, () => {
          showSuccess(downloadForm, 'We\'ve sent the catalogue to your email. Check your inbox!');
        });
      } else {
        showSuccess(downloadForm, 'We\'ve sent the catalogue to your email. Check your inbox!');
      }
    });
  }

  // ── Catalogue Form (in FAQ section) ──
  const catalogueForm = document.getElementById('catalogueForm');
  if (catalogueForm) {
    catalogueForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = catalogueForm.querySelector('input[type="email"]');
      if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        markInvalid(emailInput, 'Please enter a valid email address.');
        return;
      }
      const btn = catalogueForm.querySelector('[type="submit"]');
      if (btn) {
        withLoading(btn, btn.textContent, 900, () => {
          btn.textContent = 'Sent!';
          btn.style.background = '#16A34A';
        });
      }
    });
  }

  // ── CTA Form ──
  const ctaForm = document.getElementById('ctaForm');
  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(ctaForm)) return;
      const btn = ctaForm.querySelector('[type="submit"]');
      if (btn) {
        withLoading(btn, btn.textContent, 900, () => {
          showSuccess(ctaForm, 'We received your message! Expect a call from our team within 1 business day.');
        });
      } else {
        showSuccess(ctaForm, 'We received your message! Expect a call from our team within 1 business day.');
      }
    });
  }

  /* =====================================================
   * INIT COMPLETE
   * ===================================================== */
  console.info('[Mangalam HDPE Pipes] Scripts loaded successfully.');

})();
