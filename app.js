/* ==========================================================================
   CHARDONIC OIL & GAS LIMITED - CORE JAVASCRIPT
   Modular Interactions, GSAP ScrollTrigger Animations, FAQ & Modal Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Navigation Toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      hamburgerBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 2. Global Contact Modal Logic
  const contactModal = document.getElementById('contactModal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.getElementById('closeModalBtn');

  function openModal() {
    if (contactModal) {
      contactModal.classList.add('active');
      contactModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    }
  }

  function closeModal() {
    if (contactModal) {
      contactModal.classList.remove('active');
      contactModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }
  }

  openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeModal();
    });
  }

  // Keyboard accessibility (ESC to close modal / lightbox)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeLightbox();
    }
  });

  // 3. Form Validation & Simulation
  const globalContactForm = document.getElementById('globalContactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (globalContactForm) {
    globalContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formFeedback.style.color = '#11130C';
      formFeedback.textContent = 'Sending message...';

      setTimeout(() => {
        formFeedback.style.color = '#8a9402';
        formFeedback.textContent = 'Thank you! Your message has been received by Chardonic Oil & Gas.';
        globalContactForm.reset();
      }, 1200);
    });
  }

  // 4. FAQ Accordions
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all accordion items in current parent
        const parentAccordion = item.closest('.faq-accordion');
        if (parentAccordion) {
          parentAccordion.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        }

        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 5. Gallery Category Filter & Lightbox
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  let currentGalleryIndex = 0;
  let activeGalleryList = [];

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Triggers
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger-btn');
  lightboxTriggers.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      activeGalleryList = Array.from(lightboxTriggers);
      currentGalleryIndex = idx;
      openLightbox(btn);
    });
  });

  function openLightbox(btn) {
    if (!lightboxModal) return;
    const src = btn.getAttribute('data-src');
    const title = btn.getAttribute('data-title');
    const category = btn.getAttribute('data-category');

    lightboxImg.src = src;
    lightboxTitle.textContent = title;
    lightboxCategory.textContent = category;

    lightboxModal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', () => {
      if (activeGalleryList.length > 0) {
        currentGalleryIndex = (currentGalleryIndex - 1 + activeGalleryList.length) % activeGalleryList.length;
        openLightbox(activeGalleryList[currentGalleryIndex]);
      }
    });
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', () => {
      if (activeGalleryList.length > 0) {
        currentGalleryIndex = (currentGalleryIndex + 1) % activeGalleryList.length;
        openLightbox(activeGalleryList[currentGalleryIndex]);
      }
    });
  }

  // 6. GSAP Animations & ScrollTrigger Init
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Reveals
    gsap.from('.gsap-reveal-left', {
      duration: 1,
      x: -50,
      opacity: 0,
      ease: 'power3.out'
    });

    gsap.from('.gsap-reveal-right', {
      duration: 1,
      x: 50,
      opacity: 0,
      ease: 'power3.out'
    });

    // ScrollTrigger Card Staggers
    gsap.utils.toArray('.gsap-card').forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    // Fade Sections
    gsap.utils.toArray('.gsap-fade').forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%'
        },
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power2.out'
      });
    });
  }

});


/* ---------- Scroll To Top Button ---------- */
const scrollTopBtn = document.getElementById('scrollTopBtn');

if (scrollTopBtn) {
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  // Fast smooth scroll to top on click
  scrollTopBtn.addEventListener('click', () => {
    const scrollStep = -window.scrollY / (10 / 15); // ~250ms duration
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  });
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});