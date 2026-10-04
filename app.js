/* ==========================================================================
   ENG. MOHAMED SAMI HAIKAL — COMPANY PROFILE APPLICATION SCRIPT
   Interactive 16:9 Presentation Deck, Before/After Slider, Modals & System Engine
   ========================================================================== */

(function () {
  'use strict';

  // State Management
  const isMobileScreen = () => window.innerWidth <= 768;
  const state = {
    currentSlide: 1,
    totalSlides: 7,
    mode: (document.body.classList.contains('mode-scroll') || isMobileScreen()) ? 'scroll' : 'presentation',
    isDraggingBA: false,
    commercialCurrentView: '3d', // '3d' or 'plan'
    hotelCurrentPair: 0
  };

  // Hotel Before/After Pairs Data (all available images)
  const hotelPairs = [
    { before: 'assets/2/before/1000187118.jpg', after: 'assets/optimized/after_suite.jpg', title: 'الجناح الفندقي الرئيسي (Suite Renovation)' },
    { before: 'assets/2/before/1000186308.jpg', after: 'assets/optimized/after_bed.jpg', title: 'غرفة النوم المزدوجة (King Bedroom)' },
    { before: 'assets/2/before/1000187592.jpg', after: 'assets/optimized/after_toilet.jpg', title: 'الحمامات الفندقية والرخام (Luxury Bathroom)' },
    { before: 'assets/2/before/1000186573.jpg', after: 'assets/optimized/after_door.jpg', title: 'مداخل الغرف والأبواب (Suite Entrances & Woodwork)' },
    { before: 'assets/2/before/1000186574.jpg', after: 'assets/2/after/Suite - Outside.jpg', title: 'الجناح الخارجي (Suite Exterior)' },
    { before: 'assets/2/before/1000187115.jpg', after: 'assets/2/after/Suite - Door 1.jpg', title: 'مدخل الجناح الفاخر (Suite Main Entrance)' },
    { before: 'assets/2/before/1000221273.jpg', after: 'assets/2/after/Suite - Indoor.jpg', title: 'الديكور الداخلي للجناح (Suite Indoor Decor)' },
    { before: 'assets/2/before/1000186308.jpg', after: 'assets/2/after/Suite - King Bed 2.jpg', title: 'غرفة النوم الملكية (King Suite Bedroom)' },
    { before: 'assets/2/before/1000187592.jpg', after: 'assets/2/after/Double Room - Toilet 3.jpg', title: 'حمام الغرفة المزدوجة (Double Room Bathroom)' },
    { before: 'assets/2/before/1000187118.jpg', after: 'assets/2/after/Suite - Outside 2.jpg', title: 'الجناح الخارجي الثاني (Suite Exterior View 2)' }
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

    // Update Mobile Nav links
    const mNavLinks = document.querySelectorAll('.m-nav-item');
    mNavLinks.forEach((link) => {
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
  }

  window.goToSlide = function (n) {
    if (n < 1) n = 1;
    if (n > state.totalSlides) n = state.totalSlides;
    state.currentSlide = n;
    updateSlidesUI();

    const targetPage = document.getElementById(`page-${n}`);
    if (targetPage) {
      if (state.mode === 'scroll' || window.innerWidth <= 768) {
        const headerOffset = 64;
        const elementPosition = targetPage.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    }
  };

  window.nextSlide = function () {
    if (state.currentSlide < state.totalSlides) {
      state.currentSlide++;
    } else {
      state.currentSlide = 1; // loop back to cover
    }
    goToSlide(state.currentSlide);
  };

  window.prevSlide = function () {
    if (state.currentSlide > 1) {
      state.currentSlide--;
    } else {
      state.currentSlide = state.totalSlides;
    }
    goToSlide(state.currentSlide);
  };

  window.handleNavClick = function (e, pageNum) {
    e.preventDefault();
    goToSlide(pageNum);
  };

  /* --------------------------------------------------------------------------
     MOBILE NAVIGATION DRAWER
     -------------------------------------------------------------------------- */
  window.toggleMobileMenu = function () {
    const drawer = document.getElementById('mobile-nav-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');
    const btnMenu = document.getElementById('btn-mobile-menu');
    if (!drawer) return;
    const isOpen = drawer.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active', isOpen);
    if (btnMenu) {
      const openIcon = btnMenu.querySelector('.icon-menu-open');
      const closeIcon = btnMenu.querySelector('.icon-menu-close');
      if (openIcon && closeIcon) {
        openIcon.style.display = isOpen ? 'none' : 'block';
        closeIcon.style.display = isOpen ? 'block' : 'none';
      }
    }
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  window.closeMobileMenu = function () {
    const drawer = document.getElementById('mobile-nav-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');
    const btnMenu = document.getElementById('btn-mobile-menu');
    if (drawer) drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (btnMenu) {
      const openIcon = btnMenu.querySelector('.icon-menu-open');
      const closeIcon = btnMenu.querySelector('.icon-menu-close');
      if (openIcon && closeIcon) {
        openIcon.style.display = 'block';
        closeIcon.style.display = 'none';
      }
    }
    document.body.style.overflow = '';
  };

  window.handleMobileNavClick = function (e, pageNum) {
    e.preventDefault();
    closeMobileMenu();
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
    // If lightbox is open — handle its keys
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') { closeLightbox(); return; }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); lightboxNav(1); return; }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); lightboxNav(-1); return; }
      return; // don't propagate to slide nav while lightbox is open
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
     LIGHTBOX / GALLERY NAVIGATION
     -------------------------------------------------------------------------- */
  // Hotel Full Photo Gallery Data (7 Before + 26 After = 33 photos)
  const hotelGalleryItems = [
    // --- قبل التطوير (BEFORE) - 7 صور ---
    { src: 'assets/2/before/1000186308.jpg', caption: 'مشروع موتيل الأقصر — قبل التطوير (1/7): أعمال التكسير وإزالة التشطيب القديم' },
    { src: 'assets/2/before/1000186573.jpg', caption: 'مشروع موتيل الأقصر — قبل التطوير (2/7): تأسيس مسارات الكهرباء وتجهيز الحوائط' },
    { src: 'assets/2/before/1000186574.jpg', caption: 'مشروع موتيل الأقصر — قبل التطوير (3/7): أعمال المحارة وتأسيسات السباكة' },
    { src: 'assets/2/before/1000187115.jpg', caption: 'مشروع موتيل الأقصر — قبل التطوير (4/7): تجهيز الغرف وإعادة تقسيم المساحات' },
    { src: 'assets/2/before/1000187118.jpg', caption: 'مشروع موتيل الأقصر — قبل التطوير (5/7): تمديدات الحمامات وشبكة الصرف' },
    { src: 'assets/2/before/1000187592.jpg', caption: 'مشروع موتيل الأقصر — قبل التطوير (6/7): معالجة الأرضيات وتجهيز الفتحات المعمارية' },
    { src: 'assets/2/before/1000221273.jpg', caption: 'مشروع موتيل الأقصر — قبل التطوير (7/7): الممرات والغرف قبل التشطيب النهائي' },

    // --- بعد التشطيب (AFTER) - 26 صورة ---
    { src: 'assets/2/after/Suite - Indoor.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (1/26): الجناح الرئاسي — الصالة الداخلية والمفروشات الفاخرة' },
    { src: 'assets/2/after/Suite - King Bed 2.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (2/26): غرفة النوم الملكية (King Suite Bedroom) — إضاءة وألواح خشبية' },
    { src: 'assets/2/after/Room - Bed.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (3/26): الغرفة الفندقية المزدوجة — تشطيب عصري وإضاءة مخفية' },
    { src: 'assets/2/after/Suite - Outside.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (4/26): التراس والواجهة الخارجية للجناح — إطلالة فندقية راقية' },
    { src: 'assets/2/after/Suite - Outside 2.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (5/26): منطقة الجلوس الخارجية التابعة للجناح' },
    { src: 'assets/2/after/Suite - Door 1.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (6/26): المدخل الرئيسي للجناح — باب خشب أرو وتشطيب مودرن' },
    { src: 'assets/2/after/Suite - Door 2.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (7/26): الممر الداخلي وباب الجناح الفاخر' },
    { src: 'assets/2/after/Double Room - Toilet.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (8/26): الحمام الفندقي الفاخر — رخام بورسلين وإكسسوارات ذهبية' },
    { src: 'assets/2/after/Double Room - Toilet 3.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (9/26): كابينة الشاور والحمام الفندقي' },
    { src: 'assets/2/after/Room - Toilet 1.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (10/26): تفاصيل تشطيب الحمام — حوض رخام وإضاءة ليد مخفية' },
    { src: 'assets/2/after/869450363.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (11/26): أعمال التشطيب الداخلي المكتملة — دهانات وديكورات جدارية' },
    { src: 'assets/2/after/913141967.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (12/26): تشطيب الأرضيات والبورسلين — إتقان الفواصل وجودة التنفيذ' },
    { src: 'assets/2/after/Luxor Motel - Facade & Entrance.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (13/26): الواجهة المعمارية والمدخل الرئيسي لموتيل الأقصر والمكتب السياحي' },
    { src: 'assets/2/after/Luxor Motel - Twin Room Beds.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (14/26): الغرفة المزدوجة — أسرّة مفردة، دولاب مدمج، تسريحة وشاشة تلفزيون' },
    { src: 'assets/2/after/Luxor Motel - Twin Room Window.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (15/26): الغرفة المزدوجة — إطلالة الشباك الخشبي التراثي وتكييف الهواء' },
    { src: 'assets/2/after/Luxor Motel - Suite Corridor & Kitchenette.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (16/26): ممر الجناح الفندقي — ميني بار/كيتشن مجهز وممر يطل على غرفة النوم' },
    { src: 'assets/2/after/Luxor Motel - Dome Suite Bed & Balcony Door.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (17/26): غرفة القبة التراثية — السرير الفندقي والباب التراثي للشرفة وسقف القبو الطوبي' },
    { src: 'assets/2/after/Luxor Motel - Dome Suite Vanity & TV.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (18/26): غرفة القبة التراثية — ركن التسريحة مع المرآة وشاشة التلفزيون والميني بار' },
    { src: 'assets/2/after/Luxor Motel - Luxury Bathroom Full View.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (19/26): الحمام الفندقي المتكامل — وحدة الحوض المعلقة، المرحاض الأسود وشاور البورسلين المزخرف' },
    { src: 'assets/2/after/Luxor Motel - Modern Bathroom Shower.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (20/26): الحمام الفندقي المودرن — كابينة شاور بجدار مزخرف ونيش إضاءة ووحدة حوض سوداء' },
    { src: 'assets/2/after/Luxor Motel - Rooftop Night Terrace.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (21/26): التراس والروف الخارجي ليلاً — جلسات عشاء وشمسيات وإضاءة بانورامية ساحرة' },
    { src: 'assets/2/after/Luxor Motel - Corridor & Wave Mirror.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (22/26): ممر الغرف وأرضيات التيرازو — مرآة ديكورية منحنية بإضاءة مخفية LED ولوحة أرقام مضيئة' },
    { src: 'assets/2/after/Luxor Motel - Room 1 Ceramic Sign & Suite.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (23/26): لوحة رقم الغرفة الخزفية التراثية (رقم 1) وإطلالة عمق على الجناح الفندقي' },
    { src: 'assets/2/after/Luxor Motel - Rooms Hallway.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (24/26): الممر الفندقي الداخلي — توزيع الإضاءة المدمجة بالسقف والأرضيات الفندقية' },
    { src: 'assets/2/after/Luxor Motel - Marble Staircase.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (25/26): السلم الداخلي — درجات رخام، لوحات فنية بإطارات مذهبة وتجاليد جدارية معمارية' },
    { src: 'assets/2/after/Luxor Motel - Stairs LED & Room Door.jpg', caption: 'مشروع موتيل الأقصر — بعد التشطيب (26/26): الدرج الداخلي بإضاءة درجات LED المخفية ومدخل الغرفة واللوحات الجدارية الفاخرة' }
  ];

  window.openHotelGallery = function (type, idx) {
    let index = 0;
    if (typeof type === 'string') {
      index = (type === 'after') ? (7 + idx) : idx;
    } else if (typeof type === 'number') {
      index = type;
    }
    galleryItems = [...hotelGalleryItems];
    currentGalleryIndex = Math.max(0, Math.min(index, galleryItems.length - 1));
    if (lightboxModal) {
      lightboxModal.classList.add('active');
      lightboxImg.style.opacity = '0';
      lightboxImg.style.transform = 'scale(0.96)';
      updateLightboxUI();
    }
  };

  // Build the gallery list from ALL clickable images in the document
  let galleryItems = [];
  let currentGalleryIndex = 0;
  let lbTouchStartX = 0;


  function buildGallery() {
    galleryItems = [];
    // Collect every element that calls openLightbox
    const allClickable = document.querySelectorAll('[onclick*="openLightbox"]');
    allClickable.forEach(el => {
      const match = el.getAttribute('onclick').match(/openLightbox\(['"](.+?)['"]\s*,\s*['"](.+?)['"]\)/);
      if (match) {
        galleryItems.push({ src: match[1], caption: match[2] });
      }
    });
    // Also include commercial images triggered by JS buttons (plan / perspective)
    if (!galleryItems.find(i => i.src === 'assets/4/PERSPECTIVE.png')) {
      galleryItems.push({ src: 'assets/4/PERSPECTIVE.png', caption: 'التصميم ثلاثي الأبعاد لاستوديو اللياقة البدنية والمنشآت الرياضية' });
      galleryItems.push({ src: 'assets/4/plan.png', caption: 'المخطط الهندسي المعماري وتوزيع الحركة والأجهزة' });
    }
  }

  function updateLightboxUI() {
    if (!lightboxModal) return;
    const item = galleryItems[currentGalleryIndex];
    if (!item) return;

    // Animate image swap
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.96)';
    setTimeout(() => {
      lightboxImg.src = item.src;
      lightboxCaption.textContent = item.caption || '';
      const counter = document.getElementById('lightbox-counter');
      if (counter) counter.textContent = (currentGalleryIndex + 1) + ' / ' + galleryItems.length;
      lightboxImg.onload = () => {
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      };
    }, 120);

    // Show/hide nav buttons
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    if (prevBtn) prevBtn.style.visibility = galleryItems.length > 1 ? 'visible' : 'hidden';
    if (nextBtn) nextBtn.style.visibility = galleryItems.length > 1 ? 'visible' : 'hidden';
  }

  window.openLightbox = function (src, caption) {
    if (!lightboxModal) return;
    buildGallery();
    const idx = galleryItems.findIndex(i => i.src === src);
    if (idx >= 0) {
      currentGalleryIndex = idx;
    } else {
      galleryItems.push({ src: src, caption: caption || '' });
      currentGalleryIndex = galleryItems.length - 1;
    }
    lightboxModal.classList.add('active');
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.96)';
    updateLightboxUI();
  };


  window.lightboxNav = function (dir) {
    if (galleryItems.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex + dir + galleryItems.length) % galleryItems.length;
    updateLightboxUI();
  };

  window.closeLightbox = function (e) {
    if (e && e.target === lightboxImg) return;
    if (e && (e.target.closest('.lightbox-nav-btn'))) return;
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      setTimeout(() => {
        if (!lightboxModal.classList.contains('active')) {
          lightboxImg.src = '';
        }
      }, 300);
    }
  };

  // Swipe support inside lightbox
  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', e => { lbTouchStartX = e.touches[0].clientX; }, { passive: true });
    lightboxModal.addEventListener('touchend', e => {
      const diff = lbTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) lightboxNav(diff > 0 ? 1 : -1);
    }, { passive: true });
  }

  // Build gallery once DOM is ready
  buildGallery();



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
انستجرام: https://www.instagram.com/reel/DP4LClsjc0o/?stkn=OW15cXIzcTJjM3Y2
فيسبوك: https://www.facebook.com/share/1J64SXxzkk/?mibextid=wwXIfr`;

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

  /* --------------------------------------------------------------------------
     CARD GALLERY SLIDER (for marine vessel cards & any multi-image card)
     -------------------------------------------------------------------------- */
  function initCardGalleries() {
    document.querySelectorAll('.card-gallery').forEach(gallery => {
      const id = gallery.id;
      const dotsEl = document.getElementById('dots-' + id);
      const imgs = gallery.querySelectorAll('.card-gallery-img');
      if (!dotsEl || imgs.length === 0) return;
      // Build dots
      dotsEl.innerHTML = '';
      imgs.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'cgal-dot' + (i === 0 ? ' active' : '');
        dotsEl.appendChild(dot);
      });
    });
  }

  window.cardGalleryNav = function (galleryId, dir) {
    const gallery = document.getElementById(galleryId);
    if (!gallery) return;
    const imgs = Array.from(gallery.querySelectorAll('.card-gallery-img'));
    const dots = document.querySelectorAll('#dots-' + galleryId + ' .cgal-dot');
    const current = imgs.findIndex(img => img.classList.contains('active'));
    const next = (current + dir + imgs.length) % imgs.length;
    imgs[current].classList.remove('active');
    imgs[next].classList.add('active');
    dots.forEach((d, i) => d.classList.toggle('active', i === next));
  };

  // Init
  initCardGalleries();
  updateSlidesUI();
})();
