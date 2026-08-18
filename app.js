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
      hamburgerBtn.classList.toggle('active', isExpanded);
      hamburgerBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Send FormSubmit forms without navigating away from the page.
  const submitPopup = document.getElementById('submitPopup');
  const submitPopupClose = document.getElementById('submitPopupClose');
  const submitPopupDone = document.getElementById('submitPopupDone');

  const closeSubmitPopup = () => {
    if (!submitPopup) return;
    submitPopup.classList.remove('active');
    submitPopup.setAttribute('aria-hidden', 'true');
  };

  document.querySelectorAll('form.contact-form').forEach(form => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = form.querySelector('[type="submit"]');
      const originalLabel = submitButton.innerHTML;

      submitButton.disabled = true;
      submitButton.innerHTML = 'Sending...';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form)))
        });

        if (!response.ok) throw new Error('Form submission failed');
        form.reset();
        if (submitPopup) {
          submitPopup.classList.add('active');
          submitPopup.setAttribute('aria-hidden', 'false');
          submitPopupClose.focus();
        }
      } catch (error) {
        window.alert('We could not submit your message. Please try again or email chardonicoilandgas@gmail.com.');
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalLabel;
      }
    });
  });

  if (submitPopupClose) submitPopupClose.addEventListener('click', closeSubmitPopup);
  if (submitPopupDone) submitPopupDone.addEventListener('click', closeSubmitPopup);
  if (submitPopup) submitPopup.addEventListener('click', event => {
    if (event.target === submitPopup) closeSubmitPopup();
  });

  // 3. Keyboard accessibility for popups and the gallery lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSubmitPopup();
      closeLightbox();
    }
  });

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
          parentAccordion.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('active');
            const button = i.querySelector('.faq-question');
            if (button) button.setAttribute('aria-expanded', 'false');
          });
        }

        if (!isActive) {
          item.classList.add('active');
        }
        questionBtn.setAttribute('aria-expanded', String(!isActive));
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
