/* ============================================================
   CREATIVO CREATES — main.js
   ============================================================

   01  NAVBAR — scroll state + active link
   02  MOBILE MENU
   03  CUSTOM CURSOR
   04  ORB BACKGROUND PARALLAX
   05  SCROLL REVEAL
   06  STATS COUNTER
   07  VIMEO MODAL (showreel)
   08  SCROLL TO TOP
   09  WORK PAGE — filter dropdown
   10  ABOUT PAGE — tools tabs
   11  ABOUT PAGE — tools accordion (mobile)
   12  INIT

   ============================================================ */

(function () {
  'use strict';


  /* ============================================================
     01  NAVBAR
     ============================================================ */

  function initNavbar() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    // Scroll state
    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Run on load

    // Active link detection
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const hrefBase = href.replace('.html', '').replace(/^\//, '');
      const pathBase = currentPath.replace('.html', '').replace(/^\//, '');

      // Home
      if ((hrefBase === 'index' || hrefBase === '') && (pathBase === '' || pathBase === 'index')) {
        link.classList.add('active');
        return;
      }

      // Case studies count as work
      if (hrefBase === 'work' && pathBase.startsWith('case-study')) {
        link.classList.add('active');
        return;
      }

      // All other pages
      if (hrefBase && pathBase.includes(hrefBase)) {
        link.classList.add('active');
      }
    });

    // Mirror active state in mobile menu
    document.querySelectorAll('.mobile-link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const hrefBase = href.replace('.html', '').replace(/^\//, '');
      const pathBase = currentPath.replace('.html', '').replace(/^\//, '');

      if ((hrefBase === 'index' || hrefBase === '') && (pathBase === '' || pathBase === 'index')) {
        link.classList.add('active');
        return;
      }
      if (hrefBase === 'work' && pathBase.startsWith('case-study')) {
        link.classList.add('active');
        return;
      }
      if (hrefBase && pathBase.includes(hrefBase)) {
        link.classList.add('active');
      }
    });
  }


  /* ============================================================
     02  MOBILE MENU
     ============================================================ */

  function initMobileMenu() {
    const hamburger = document.querySelector('.nav-hamburger');
    const menu      = document.querySelector('.mobile-menu');
    const closeBtn  = document.querySelector('.mobile-close');
    const backdrop  = document.querySelector('.nav-backdrop');

    if (!hamburger || !menu) return;

    const links = menu.querySelectorAll('.mobile-link');

    function openMenu() {
      menu.classList.add('open');
      backdrop && backdrop.classList.add('visible');
      document.body.style.overflow = 'hidden';

      // Stagger link animation delays
      links.forEach((link, i) => {
        link.style.animationDelay = `${0.08 * (i + 1)}s`;
      });
    }

    function closeMenu() {
      menu.classList.remove('open');
      backdrop && backdrop.classList.remove('visible');
      document.body.style.overflow = '';

      links.forEach(link => {
        link.style.animationDelay = '0s';
      });
    }

    hamburger.addEventListener('click', openMenu);
    closeBtn && closeBtn.addEventListener('click', closeMenu);
    backdrop && backdrop.addEventListener('click', closeMenu);

    // Close on ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
  }


  /* ============================================================
     03  CUSTOM CURSOR
     ============================================================ */

  function initCursor() {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    if (!dot || !ring) return;

    // Don't run on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let rafId;

    const HOVER_TARGETS = 'a, button, .project-card, .filter-btn, .discipline-item, .service-block, .stat-item, input, textarea, select, label, .tab-btn, .accordion-btn, .dropdown-item, .dropdown-trigger';

    const onMove = e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.11;
      ringY += (mouseY - ringY) * 0.11;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      rafId = requestAnimationFrame(animateRing);
    };
    animateRing();

    const onOver = e => {
      if (e.target.closest(HOVER_TARGETS)) {
        dot.classList.add('hovering');
        ring.classList.add('hovering');
      }
    };

    const onOut = e => {
      if (e.target.closest(HOVER_TARGETS)) {
        dot.classList.remove('hovering');
        ring.classList.remove('hovering');
      }
    };

    const onDown = () => {
      dot.classList.add('clicking');
      ring.classList.add('clicking');
    };

    const onUp = () => {
      dot.classList.remove('clicking');
      ring.classList.remove('clicking');
    };

    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const onEnter = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    document.addEventListener('mousemove',  onMove);
    document.addEventListener('mouseover',  onOver);
    document.addEventListener('mouseout',   onOut);
    document.addEventListener('mousedown',  onDown);
    document.addEventListener('mouseup',    onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
  }


  /* ============================================================
     04  ORB BACKGROUND PARALLAX
     ============================================================ */

  function initOrbParallax() {
    if (window.matchMedia('(hover: none)').matches) return;

    const orbs = document.querySelectorAll('.orb');
    if (!orbs.length) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId;

    const onMove = e => {
      targetX = (e.clientX / window.innerWidth  - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const update = () => {
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;

      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 14;
        orb.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
      });

      rafId = requestAnimationFrame(update);
    };
    update();

    document.addEventListener('mousemove', onMove);
  }


  /* ============================================================
     05  SCROLL REVEAL
     ============================================================ */

  function initScrollReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      // Looser settings: trigger earlier, lower threshold
      // so content above the fold on load also reveals correctly
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    );

    elements.forEach(el => observer.observe(el));
  }


  /* ============================================================
     06  STATS COUNTER
     ============================================================ */

  function initStatsCounter() {
    const statItems = document.querySelectorAll('.stat-item[data-count]');
    if (!statItems.length) return;

    statItems.forEach(item => {
      const end      = parseInt(item.dataset.count, 10);
      const duration = 1900;
      const valueEl  = item.querySelector('.stat-count-value');
      if (!valueEl) return;

      let started = false;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !started) {
            started = true;
            const startTime = performance.now();

            const tick = now => {
              const elapsed  = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased    = 1 - Math.pow(1 - progress, 3);
              valueEl.textContent = Math.round(eased * end);
              if (progress < 1) requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
            observer.unobserve(item);
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(item);
    });
  }


  /* ============================================================
     07  VIMEO MODAL (showreel)
     ============================================================ */

  function initShowreelModal() {
    const openBtn = document.getElementById('openShowreel');
    const modal   = document.getElementById('showreelModal');
    const closeBtn = document.getElementById('closeShowreel');
    const player  = document.getElementById('vimeoPlayer');

    if (!openBtn || !modal || !player) return;

    // Replace YOUR_VIMEO_ID with your actual Vimeo video ID
    const VIMEO_ID = 'YOUR_VIMEO_ID';
    const VIMEO_SRC = `https://player.vimeo.com/video/${VIMEO_ID}?autoplay=1&title=0&byline=0&portrait=0&color=2060ff`;

    function openModal() {
      player.src = VIMEO_SRC;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      player.src = '';               // Stops video playback
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', openModal);
    closeBtn && closeBtn.addEventListener('click', closeModal);

    // Click outside container closes modal
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });

    // ESC key closes modal
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }


  /* ============================================================
     08  SCROLL TO TOP
     ============================================================ */

  function initScrollToTop() {
    const btn = document.querySelector('.scroll-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('is-visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ============================================================
     09  WORK PAGE — filter dropdown
     ============================================================ */

  function initWorkFilter() {
    const dropdown    = document.querySelector('.filter-dropdown');
    const workItems   = document.querySelectorAll('.work-item');

    if (!dropdown || !workItems.length) return;

    const trigger     = dropdown.querySelector('.dropdown-trigger');
    const menu        = dropdown.querySelector('.dropdown-menu');
    const items       = dropdown.querySelectorAll('.dropdown-item');
    const triggerText = dropdown.querySelector('.dropdown-trigger-text');

    // Toggle
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });

    // Filter logic
    items.forEach(item => {
      item.addEventListener('click', () => {
        const filter = item.dataset.filter;

        // Update UI
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        triggerText.textContent = item.textContent.trim();
        dropdown.classList.remove('open');

        // Show/hide items
        workItems.forEach(proj => {
          const category = proj.dataset.category;
          const show = filter === 'All' || category === filter;
          proj.classList.toggle('hidden', !show);
        });

        // Re-run scroll reveal for newly visible items
        document.querySelectorAll('.work-item:not(.hidden) [data-reveal]:not(.revealed)').forEach(el => {
          el.classList.add('revealed');
        });
      });
    });
  }


  /* ============================================================
     10  ABOUT PAGE — tools tabs (desktop)
     ============================================================ */

  function initToolsTabs() {
    const tabs   = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tools-panel-section');

    if (!tabs.length || !panels.length) return;

    // Show first tab on init
    tabs[0] && tabs[0].classList.add('tab-active');
    panels[0] && (panels[0].style.display = 'flex');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        // Update tabs
        tabs.forEach(t => t.classList.remove('tab-active'));
        tab.classList.add('tab-active');

        // Update panels
        panels.forEach(panel => {
          panel.style.display = panel.dataset.panel === target ? 'flex' : 'none';
        });
      });
    });
  }


  /* ============================================================
     11  ABOUT PAGE — tools accordion (mobile)
     ============================================================ */

  function initAccordion() {
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    if (!accordionBtns.length) return;

    accordionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const item   = btn.closest('.accordion-item');
        const isOpen = item.classList.contains('accordion-open');

        // Close all
        document.querySelectorAll('.accordion-item').forEach(i => {
          i.classList.remove('accordion-open');
        });

        // Open clicked if it was closed
        if (!isOpen) item.classList.add('accordion-open');
      });
    });
  }



  /* ============================================================
     12  INIT — Run everything on DOMContentLoaded
     ============================================================ */

  document.addEventListener('DOMContentLoaded', () => {

    initNavbar();
    initMobileMenu();
    initCursor();
    initOrbParallax();
    initScrollReveal();
    initStatsCounter();
    initShowreelModal();
    initScrollToTop();
    initWorkFilter();
    initToolsTabs();
    initAccordion();
  });

})();
