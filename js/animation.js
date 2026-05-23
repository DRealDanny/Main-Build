/* ============================================================
   CREATIVO CREATES — animation.js
   GSAP + Three.js animations
   Requires: gsap.min.js, ScrollTrigger.min.js, three.min.js (CDN)
   ============================================================

   01  GSAP SETUP
   02  HERO THREE.JS CANVAS
   03  HERO ENTRANCE (GSAP)
   04  INIT

   NOTE: Scroll reveals for cards, service blocks, disciplines,
   and process steps are handled entirely by the CSS [data-reveal]
   system + IntersectionObserver in main.js.
   DO NOT use gsap.set() on elements that also use [data-reveal] —
   GSAP inline styles override CSS class changes and prevent reveals.

   ============================================================ */

(function () {
  'use strict';

  // Guard — only run if GSAP is available
  if (typeof gsap === 'undefined') {
    console.warn('animation.js: GSAP not loaded.');
    return;
  }


  /* ============================================================
     01  GSAP SETUP
     ============================================================ */

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.config({ limitCallbacks: true });


  /* ============================================================
     02  HERO THREE.JS CANVAS
     ============================================================ */

  function initHeroCanvas() {
    const container = document.getElementById('heroCanvas');
    if (!container) return;
    if (window.innerWidth <= 1024) return;
    if (typeof THREE === 'undefined') {
      console.warn('animation.js: Three.js not loaded.');
      return;
    }

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(500, 500);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(2.5, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x1A5BFF,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    camera.position.z = 5;

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      sphere.rotation.x += 0.001;
      sphere.rotation.y += 0.002;
      sphere.position.y  = Math.sin(t * 0.5) * 0.1;
      renderer.render(scene, camera);
    }

    animate();
  }


  /* ============================================================
     03  HERO ENTRANCE (GSAP)
     Handles: subtitle, actions row, scroll indicator only.
     Eyebrow + title words use CSS animations (word-rise, fade-in).
     These elements do NOT use [data-reveal] — safe to use gsap.from().
     ============================================================ */

  function initHeroEntrance() {
    const subtitle = document.querySelector('.hero-subtitle');
    const actions  = document.querySelector('.hero-actions');
    const scroll   = document.querySelector('.hero-scroll');

    // Nothing to animate — not the home page
    if (!subtitle && !actions && !scroll) return;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    if (subtitle) tl.from(subtitle, { opacity: 0, y: 28, duration: 0.85 }, 0.75);
    if (actions)  tl.from(actions,  { opacity: 0, y: 22, duration: 0.80 }, 0.90);
    if (scroll)   tl.from(scroll,   { opacity: 0,        duration: 0.70 }, 1.40);
  }


  /* ============================================================
     04  INIT
     ============================================================ */

  document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    initHeroEntrance();
  });

})();
