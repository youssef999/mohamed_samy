/* ==========================================================================
   ENG. MOHAMED SAMI HAIKAL — COMPANY PROFILE APPLICATION SCRIPT
   Interactive 16:9 Presentation Deck, Before/After Slider, Modals & System Engine
   ========================================================================== */

(function () {
  'use strict';

  // State Management
  const state = {
    currentSlide: 1,
    totalSlides: 7,
    mode: 'presentation', // 'presentation' or 'scroll'
    isDraggingBA: false,
    commercialCurrentView: '3d', // '3d' or 'plan'
    hotelCurrentPair: 0
  };

  // Hotel Before/After Pairs Data
  const hotelPairs = [
    {
      before: 'assets/2/before/1000187118.jpg',
      after: 'assets/optimized/after_suite.jpg',
      title: 'الجناح الفندقي الرئيسي (Suite Renovation)'
    },
    {
      before: 'assets/2/before/1000186308.jpg',
      after: 'assets/optimized/after_bed.jpg',
      title: 'غرفة النوم المزدوجة (King Bedroom)'
    },
    {
      before: 'assets/2/before/1000187592.jpg',
      after: 'assets/optimized/after_toilet.jpg',
      title: 'الحمامات الفندقية والرخام (Luxury Bathroom)'
    },
    {
      before: 'assets/2/before/1000186573.jpg',
      after: 'assets/optimized/after_door.jpg',
      title: 'مداخل الغرف والأبواب (Suite Entrances & Woodwork)'
    }
  ];

  // DOM Elements
  const pages = document.querySelectorAll('.profile-page');
  const navLinks = document.querySelectorAll('.nav-link');
  const hudDots = document.querySelectorAll('.hud-dot');
  const hudCount = document.getElementById('hud-page-count');
  const btnModePresentation = document.getElementById('btn-mode-presentation');
  const btnModeScroll = document.getElementById('btn-mode-scroll');

  // Slider Before/After Elements
  const baSlider = document.getElementById('hotel-ba-slider');
  const baAfterLayer = document.getElementById('ba-after-layer');
  const baHandleLine = document.getElementById('ba-handle-line');
  const baHandleCircle = document.getElementById('ba-handle-circle');
  const baBeforeImg = document.getElementById('ba-before-img');
  const baAfterImg = document.getElementById('ba-after-img');

  // Commercial Display Elements
  const commMainImg = document.getElementById('comm-main-img');
  const commBadgeTitle = document.getElementById('comm-badge-title');
  const btnView3D = document.getElementById('btn-view-3d');
  const btnViewPlan = document.getElementById('btn-view-plan');

  // Lightbox & Toast
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const toastMsg = document.getElementById('toast-msg');
  const toastText = document.getElementById('toast-text');

  /* --------------------------------------------------------------------------
     SLIDE DECK NAVIGATION (16:9 PRESENTATION MODE)
     -------------------------------------------------------------------------- */
  function updateSlidesUI() {
    pages.forEach((page) => {
      const pageNum = parseInt(page.getAttribute('data-page'), 10);
      if (pageNum === state.currentSlide) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    // Update Nav links
    navLinks.forEach((link) => {
      const pageNum = parseInt(link.getAttribute('data-page'), 10);
      if (pageNum === state.currentSlide) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update HUD dots
    hudDots.forEach((dot, idx) => {
      if (idx + 1 === state.currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update Page Count
    if (hudCount) {
      hudCount.textContent = `0${state.currentSlide} / 0${state.totalSlides}`;
    }

    // Scroll smoothly to section if in scroll mode
    if (state.mode === 'scroll') {
      const targetPage = document.getElementById(`page-${state.currentSlide}`);
      if (targetPage) {
        targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  window.goToSlide = function (n) {
    if (n < 1) n = 1;
    if (n > state.totalSlides) n = state.totalSlides;
    state.currentSlide = n;
    updateSlidesUI();
  };

  window.nextSlide = function () {
    if (state.currentSlide < state.totalSlides) {
      state.currentSlide++;
    } else {
      state.currentSlide = 1; // loop back to cover
    }
    updateSlidesUI();
  };

  window.prevSlide = function () {
    if (state.currentSlide > 1) {
      state.currentSlide--;
    } else {
      state.currentSlide = state.totalSlides;
    }
    updateSlidesUI();
  };

  window.handleNavClick = function (e, pageNum) {
    e.preventDefault();
    goToSlide(pageNum);
  };

  /* --------------------------------------------------------------------------
     MODE SWITCHER (16:9 SLIDES VS FLUID SCROLL)
     -------------------------------------------------------------------------- */
  window.setMode = function (mode) {
    state.mode = mode;
    if (mode === 'presentation') {
      document.body.classList.remove('mode-scroll');
      document.body.classList.add('mode-presentation');
      btnModePresentation.classList.add('active');
      btnModeScroll.classList.remove('active');
      goToSlide(state.currentSlide);
      showToast('تم تفعيل وضع العرض التقديمي 16:9');
    } else {
      document.body.classList.remove('mode-presentation');
      document.body.classList.add('mode-scroll');
      btnModePresentation.classList.remove('active');
      btnModeScroll.classList.add('active');
      showToast('تم تفعيل وضع التصفح المستمر');
    }
  };

  /* --------------------------------------------------------------------------
     KEYBOARD NAVIGATION SHORTCUTS
     -------------------------------------------------------------------------- */
  document.addEventListener('keydown', function (e) {
    // If lightbox is open, Escape closes it
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') {
        closeLightbox();
        return;
      }
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    } else if (e.key === 'm' || e.key === 'M') {
      setMode(state.mode === 'presentation' ? 'scroll' : 'presentation');
    }
  });

  /* --------------------------------------------------------------------------
     TOUCH SWIPE SUPPORT FOR MOBILE / TABLET
     -------------------------------------------------------------------------- */
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    if (state.mode !== 'presentation') return;
    const diffX = e.changedTouches[0].screenX - touchStartX;
    const diffY = e.changedTouches[0].screenY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX < 0) {
        // Swipe left (next in RTL or standard)
        nextSlide();
      } else {
        // Swipe right
        prevSlide();
      }
    }
  }, { passive: true });

  /* --------------------------------------------------------------------------
     FULLSCREEN CONTROLLER
     -------------------------------------------------------------------------- */
  window.toggleFullscreen = function () {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      showToast('وضع الشاشة الكاملة');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  /* --------------------------------------------------------------------------
     HOTEL BEFORE & AFTER INTERACTIVE SLIDER
     -------------------------------------------------------------------------- */
  function setBAPercentage(percentage) {
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;

    if (baAfterLayer && baHandleLine) {
      baAfterLayer.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
      baHandleLine.style.left = `${percentage}%`;
    }
  }

  function handleBAMove(e) {
    if (!baSlider) return;
    const rect = baSlider.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const offsetX = clientX - rect.left;
    const percentage = (offsetX / rect.width) * 100;
    setBAPercentage(percentage);
  }

  if (baSlider) {
    baSlider.addEventListener('mousedown', function (e) {
      state.isDraggingBA = true;
      handleBAMove(e);
    });

    window.addEventListener('mousemove', function (e) {
      if (state.isDraggingBA) {
        handleBAMove(e);
      }
    });

    window.addEventListener('mouseup', function () {
      state.isDraggingBA = false;
    });

    baSlider.addEventListener('touchstart', function (e) {
      state.isDraggingBA = true;
      handleBAMove(e);
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
      if (state.isDraggingBA) {
        handleBAMove(e);
      }
    }, { passive: true });

    window.addEventListener('touchend', function () {
      state.isDraggingBA = false;
    });
  }

  window.switchHotelPair = function (idx) {
    state.hotelCurrentPair = idx;
    const pair = hotelPairs[idx];
    if (!pair) return;

    if (baBeforeImg) baBeforeImg.src = pair.before;
    if (baAfterImg) baAfterImg.src = pair.after;

    const thumbBtns = document.querySelectorAll('.hotel-thumb-btn');
    thumbBtns.forEach((btn, i) => {
      if (i === idx) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    // Reset handle to center
    setBAPercentage(50);
    showToast(`تم عرض: ${pair.title}`);
  };

  /* --------------------------------------------------------------------------
     PAGE 5: MARINE FILTER CONTROLLER
     -------------------------------------------------------------------------- */
  window.filterMarine = function (category) {
    const cards = document.querySelectorAll('.marine-vessel-card');
    const pills = document.querySelectorAll('.marine-pill-btn');

    pills.forEach((p) => {
      const match = p.getAttribute('onclick').includes(category);
      if (match) p.classList.add('active');
      else p.classList.remove('active');
    });

    cards.forEach((card) => {
      const cardCat = card.getAttribute('data-category');
      if (category === 'all' || cardCat === category) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (card.style.opacity === '0') card.style.display = 'none';
        }, 300);
      }
    });
  };

  /* --------------------------------------------------------------------------
     PAGE 6: COMMERCIAL 3D PERSPECTIVE VS 2D PLAN
     -------------------------------------------------------------------------- */
  window.switchCommercialView = function (view) {
    state.commercialCurrentView = view;
    if (view === '3d') {
      commMainImg.src = 'assets/optimized/gym_perspective.jpg';
      commBadgeTitle.textContent = '3D PHOTOREALISTIC PERSPECTIVE';
      btnView3D.className = 'btn-luxury btn-luxury-gold';
      btnViewPlan.className = 'btn-luxury btn-luxury-outline';
      showToast('اللقطة الواقعية ثلاثية الأبعاد 3D Perspective');
    } else {
      commMainImg.src = 'assets/optimized/gym_plan.jpg';
      commBadgeTitle.textContent = '2D ARCHITECTURAL ZONING PLAN';
      btnView3D.className = 'btn-luxury btn-luxury-outline';
      btnViewPlan.className = 'btn-luxury btn-luxury-gold';
      showToast('المخطط الهندسي وتوزيع الأجهزة 2D Zoning Plan');
    }
  };

  window.zoomCommercialCurrent = function () {
    if (state.commercialCurrentView === '3d') {
      openLightbox('assets/4/PERSPECTIVE.png', 'التصميم ثلاثي الأبعاد لاستوديو اللياقة البدنية والمنشآت الرياضية (1920x1080 Photorealistic 3D)');
    } else {
      openLightbox('assets/4/plan.png', 'المخطط الهندسي المعماري وتوزيع الحركة والأجهزة (Architectural 2D Layout & Zoning Plan)');
    }
  };

  /* --------------------------------------------------------------------------
     LIGHTBOX / HIGH RESOLUTION MODAL
     -------------------------------------------------------------------------- */
  window.openLightbox = function (src, caption) {
    if (!lightboxModal) return;
    lightboxImg.src = src;
    lightboxCaption.textContent = caption || '';
    lightboxModal.classList.add('active');
  };

  window.closeLightbox = function (e) {
    if (e && e.target === lightboxImg) return; // don't close when clicking image itself
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      setTimeout(() => {
        if (!lightboxModal.classList.contains('active')) {
          lightboxImg.src = '';
        }
      }, 300);
    }
  };

  /* --------------------------------------------------------------------------
     TOAST NOTIFICATIONS & COPY CONTACT
     -------------------------------------------------------------------------- */
  let toastTimer = null;
  window.showToast = function (text) {
    if (!toastMsg || !toastText) return;
    toastText.textContent = text;
    toastMsg.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 3200);
  };

  window.copyContactInfo = function () {
    const contactSummary = `م. محمد سامي هيكل — تصميم داخلي وتشطيبات متكاملة
هاتف وواتساب: +201062628864 / 01094577221
البريد الإلكتروني: mmdsamy3@gmail.com
انستجرام: https://www.instagram.com/reel/DP4LClsjc0o/?stkn=OW15cXIzcTJjM3Y2`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(contactSummary).then(() => {
        showToast('تم نسخ بيانات التواصل بنجاح');
      }).catch(() => {
        showToast('هاتف: 01062628864 | 01094577221');
      });
    } else {
      showToast('هاتف: 01062628864 | 01094577221');
    }
  };

  /* --------------------------------------------------------------------------
     SCROLL OBSERVER (FOR SCROLL MODE ACTIVE LINK HIGHLIGHT)
     -------------------------------------------------------------------------- */
  const observer = new IntersectionObserver((entries) => {
    if (state.mode !== 'scroll') return;
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const pageNum = parseInt(entry.target.getAttribute('data-page'), 10);
        state.currentSlide = pageNum;
        navLinks.forEach((link) => {
          const lNum = parseInt(link.getAttribute('data-page'), 10);
          if (lNum === pageNum) link.classList.add('active');
          else link.classList.remove('active');
        });
      }
    });
  }, { threshold: 0.5 });

  pages.forEach((page) => observer.observe(page));

  // Initialize
  updateSlidesUI();
})();
