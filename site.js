(function () {
  var mobileQuery = window.matchMedia('(max-width: 960px)');
  var analyticsConsentKey = 'ith_analytics_consent_v1';

  function getStoredConsent() {
    try {
      return window.localStorage.getItem(analyticsConsentKey);
    } catch (error) {
      return null;
    }
  }

  function storeConsent(value) {
    try {
      window.localStorage.setItem(analyticsConsentKey, value);
    } catch (error) {
      // Ignore storage errors in restricted browsing modes.
    }
  }

  function getInitialAnalyticsSelection(storedConsent) {
    if (storedConsent === 'granted') return true;
    if (storedConsent === 'denied') return false;

    // Default selection in the modal for first-time visitors.
    return true;
  }

  function updateAnalyticsConsent(granted) {
    if (typeof window.gtag !== 'function') return;

    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });

    if (granted) {
      window.gtag('event', 'page_view');
    }
  }

  function removeConsentBanner() {
    var existingModal = document.querySelector('.cookie-consent-backdrop');
    if (existingModal) {
      existingModal.remove();
    }
  }

  function openConsentBanner() {
    var storedConsent = getStoredConsent();

    removeConsentBanner();
    createConsentBanner(getInitialAnalyticsSelection(storedConsent));
  }

  function bindConsentSettingsLinks() {
    var links = document.querySelectorAll('.cookie-settings-link');
    if (!links.length) return;

    links.forEach(function (link) {
      if (link.dataset.cookieBound === 'true') return;

      link.addEventListener('click', function (event) {
        event.preventDefault();
        openConsentBanner();
      });

      link.dataset.cookieBound = 'true';
    });
  }

  function applyConsentSelection(granted) {
    storeConsent(granted ? 'granted' : 'denied');
    updateAnalyticsConsent(granted);
    removeConsentBanner();
  }

  function createConsentBanner(initialAnalyticsChecked) {
    if (!document.body || document.querySelector('.cookie-consent-backdrop')) return;

    var backdrop = document.createElement('div');
    backdrop.className = 'cookie-consent-backdrop';

    var banner = document.createElement('aside');
    banner.className = 'cookie-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'true');
    banner.setAttribute('aria-label', 'Cookie-Einstellungen');

    banner.innerHTML = '' +
      '<p class="cookie-consent-title">Cookie-Einstellungen</p>' +
      '<p>Wir nutzen notwendige Cookies fuer den Betrieb der Website. Optionale Analyse-Cookies (Google Analytics) helfen uns, die Seite zu verbessern. Details in der <a href="datenschutz.html">Datenschutzerklaerung</a>.</p>' +
      '<div class="cookie-consent-options">' +
      '<label class="cookie-option-row">' +
      '<input type="checkbox" class="cookie-analytics-checkbox">' +
      '<span>Analyse-Cookies (Google Analytics)</span>' +
      '</label>' +
      '</div>' +
      '<div class="cookie-consent-actions">' +
      '<button type="button" class="button cookie-consent-reject-all">Alles ablehnen</button>' +
      '<button type="button" class="button cookie-consent-save-selection">Auswahl speichern</button>' +
      '<button type="button" class="button button-primary cookie-consent-accept-all">Alles akzeptieren</button>' +
      '</div>';

    backdrop.appendChild(banner);
    document.body.appendChild(backdrop);

    var analyticsCheckbox = banner.querySelector('.cookie-analytics-checkbox');
    var acceptAllButton = banner.querySelector('.cookie-consent-accept-all');
    var rejectAllButton = banner.querySelector('.cookie-consent-reject-all');
    var saveSelectionButton = banner.querySelector('.cookie-consent-save-selection');

    if (analyticsCheckbox) {
      analyticsCheckbox.checked = Boolean(initialAnalyticsChecked);
    }

    if (acceptAllButton) {
      acceptAllButton.addEventListener('click', function () {
        if (analyticsCheckbox) analyticsCheckbox.checked = true;
        applyConsentSelection(true);
      });
    }

    if (rejectAllButton) {
      rejectAllButton.addEventListener('click', function () {
        if (analyticsCheckbox) analyticsCheckbox.checked = false;
        applyConsentSelection(false);
      });
    }

    if (saveSelectionButton) {
      saveSelectionButton.addEventListener('click', function () {
        applyConsentSelection(Boolean(analyticsCheckbox && analyticsCheckbox.checked));
      });
    }
  }

  function initAnalyticsConsent() {
    bindConsentSettingsLinks();

    var storedConsent = getStoredConsent();

    if (storedConsent === 'granted') {
      updateAnalyticsConsent(true);
      return;
    }

    if (storedConsent === 'denied') {
      updateAnalyticsConsent(false);
      return;
    }

    updateAnalyticsConsent(false);
    createConsentBanner(getInitialAnalyticsSelection(storedConsent));
  }

  function updateAnchorOffset() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    window.requestAnimationFrame(function () {
      var style = window.getComputedStyle(header);
      var isSticky = style.position === 'sticky' || style.position === 'fixed';
      var topOffset = isSticky ? parseFloat(style.top || '0') || 0 : 0;
      var headerHeight = header.getBoundingClientRect().height;
      var offset = Math.ceil(topOffset + headerHeight + 24);
      document.documentElement.style.setProperty('--anchor-offset', offset + 'px');
    });
  }

  function ensureMobileHeaderToggle() {
    var header = document.querySelector('.site-header');
    if (!header) return null;

    var existingToggle = header.querySelector('.mobile-header-toggle');
    if (existingToggle) return existingToggle;

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'mobile-header-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Header maximieren');
    toggle.textContent = '⌃';
    header.appendChild(toggle);

    return toggle;
  }

  function setHeaderCollapsed(collapsed) {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var isCollapsed = header.classList.contains('is-collapsed');
    if (isCollapsed === collapsed) return;

    header.classList.toggle('is-collapsed', collapsed);

    var toggle = header.querySelector('.mobile-header-toggle');
    if (toggle) {
      var expanded = !collapsed;
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.setAttribute('aria-label', expanded ? 'Header minimieren' : 'Header maximieren');
    }

    updateAnchorOffset();
  }

  function updateMobileHeaderState() {
    if (!mobileQuery.matches) {
      setHeaderCollapsed(false);
    } else {
      setHeaderCollapsed(true);
    }
  }

  function initMobileHeaderBehavior() {
    var toggle = ensureMobileHeaderToggle();
    if (!toggle) return;

    toggle.addEventListener('click', function () {
      var header = document.querySelector('.site-header');
      if (!header) return;

      var currentlyCollapsed = header.classList.contains('is-collapsed');
      setHeaderCollapsed(!currentlyCollapsed);
    });

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', updateMobileHeaderState);
    } else if (typeof mobileQuery.addListener === 'function') {
      mobileQuery.addListener(updateMobileHeaderState);
    }

    window.addEventListener('resize', updateMobileHeaderState);
    updateMobileHeaderState();
  }

  function enableTouchSectionGlow() {
    var isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (!isTouchDevice) return;

    var sections = document.querySelectorAll('.pillar-section');
    if (!sections.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-in-view', entry.isIntersecting);
      });
    }, { threshold: 0.25 });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function initDesktopNavDropdownHover() {
    var desktopQuery = window.matchMedia('(min-width: 961px)');
    var navDropdowns = document.querySelectorAll('.site-nav-dropdown');
    if (!navDropdowns.length) return;

    navDropdowns.forEach(function (dropdown) {
      var closeTimeoutId = null;

      function scheduleClose() {
        if (!desktopQuery.matches) return;
        if (closeTimeoutId) {
          window.clearTimeout(closeTimeoutId);
        }
        closeTimeoutId = window.setTimeout(function () {
          dropdown.removeAttribute('open');
          closeTimeoutId = null;
        }, 180);
      }

      function keepOpen() {
        if (!desktopQuery.matches) return;
        if (closeTimeoutId) {
          window.clearTimeout(closeTimeoutId);
          closeTimeoutId = null;
        }
        dropdown.setAttribute('open', '');
      }

      dropdown.addEventListener('mouseenter', function () {
        keepOpen();
      });

      dropdown.addEventListener('mouseleave', function () {
        scheduleClose();
      });

      dropdown.addEventListener('focusin', function () {
        keepOpen();
      });

      dropdown.addEventListener('focusout', function () {
        scheduleClose();
      });
    });

    function closeAllDropdownsOnMobile() {
      if (desktopQuery.matches) return;
      navDropdowns.forEach(function (dropdown) {
        dropdown.removeAttribute('open');
      });
    }

    if (typeof desktopQuery.addEventListener === 'function') {
      desktopQuery.addEventListener('change', closeAllDropdownsOnMobile);
    } else if (typeof desktopQuery.addListener === 'function') {
      desktopQuery.addListener(closeAllDropdownsOnMobile);
    }
  }

  function highlightActiveNavLink() {
    var currentPath = window.location.pathname;
    var currentPage = currentPath.split('/').pop() || '';
    
    var navLinks = document.querySelectorAll('.site-nav a');
    navLinks.forEach(function (link) {
      link.classList.remove('is-active');
      
      var href = link.getAttribute('href') || '';
      var linkPage = href.split('/').pop() || '';
      
      if (linkPage === currentPage) {
        link.classList.add('is-active');
        
        var parent = link.closest('.site-nav-parent');
        if (parent) {
          parent.classList.add('is-active');
        }
      }
    });
    
    var parentLinks = document.querySelectorAll('.site-nav-parent a');
    parentLinks.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      var linkPage = href.split('/').pop() || '';
      
      if (linkPage === currentPage) {
        link.classList.add('is-active');
        var parent = link.closest('.site-nav-parent');
        if (parent) {
          parent.classList.add('is-active');
        }
      }
    });
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initScrollReveal() {
    var root = document.documentElement;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      root.classList.remove('has-anim');
      return;
    }

    // Confirm to the inline head failsafe that the reveal logic is alive.
    root.classList.add('reveal-active');
    if (!root.classList.contains('has-anim')) {
      root.classList.add('has-anim');
    }

    var selector = [
      '.hero-copy > *', '.hero-panel > *',
      '.about-hero > div', '.about-hero > ul',
      '.about-highlight-list > li',
      '.pillar-header', '.section-heading',
      '.step-card', '.info-card', '.demo-card',
      '.contact-card', '.contact-form-card',
      '.profile-card', '.faq-item', '.legal-card',
      '.signal-card', '.stack-card', '.benefit-list > li',
      '.feature-action'
    ].join(',');

    var elements = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!elements.length) return;

    // Stagger siblings that share a parent for a cascading reveal.
    var seen = new WeakMap();
    elements.forEach(function (el) {
      var parent = el.parentNode;
      var index = seen.get(parent) || 0;
      seen.set(parent, index + 1);
      el.style.transitionDelay = Math.min(index * 80, 480) + 'ms';
    });

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initScrollProgress() {
    if (prefersReducedMotion) return;
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    var ticking = false;
    function update() {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var ratio = scrollable > 0 ? doc.scrollTop / scrollable : 0;
      bar.style.transform = 'scaleX(' + Math.min(Math.max(ratio, 0), 1) + ')';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  function initDemoLightbox() {
    var cards = document.querySelectorAll('.demo-card');
    if (!cards.length) return;

    var modal = document.createElement('div');
    modal.className = 'demo-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="demo-modal-window">' +
        '<div class="demo-modal-bar">' +
          '<div class="demo-modal-dots"><i></i><i></i><i></i></div>' +
          '<div class="demo-modal-address">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>' +
            '<span class="demo-modal-title"></span>' +
          '</div>' +
          '<div class="demo-modal-actions">' +
            '<div class="demo-segment" role="group" aria-label="Ansicht wechseln">' +
              '<button type="button" class="demo-view-desktop is-active" aria-label="Desktop-Ansicht"><svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="13" rx="2"></rect><path d="M8 21h8M12 17v4"></path></svg></button>' +
              '<button type="button" class="demo-view-mobile" aria-label="Mobile Ansicht"><svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="2"></rect><path d="M11 18h2"></path></svg></button>' +
            '</div>' +
            '<button type="button" class="demo-close" aria-label="Demo schließen"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>' +
          '</div>' +
        '</div>' +
        '<div class="demo-modal-stage">' +
          '<div class="demo-frame-wrap"></div>' +
          '<div class="demo-loader" aria-hidden="true"><span></span></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    var stage = modal.querySelector('.demo-modal-stage');
    var frameWrap = modal.querySelector('.demo-frame-wrap');
    var titleEl = modal.querySelector('.demo-modal-title');
    var loader = modal.querySelector('.demo-loader');
    var btnDesktop = modal.querySelector('.demo-view-desktop');
    var btnMobile = modal.querySelector('.demo-view-mobile');
    var closeBtn = modal.querySelector('.demo-close');
    var lastFocused = null;
    var currentUrl = '';

    function buildFrame() {
      frameWrap.innerHTML = '';
      var frame = document.createElement('iframe');
      frame.setAttribute('title', 'Live-Demo Vorschau');
      frame.setAttribute('loading', 'lazy');
      frame.setAttribute(
        'sandbox',
        'allow-scripts allow-same-origin allow-popups allow-forms'
      );
      loader.classList.remove('is-hidden');
      frame.addEventListener('load', function () {
        loader.classList.add('is-hidden');
      });
      frame.src = currentUrl;
      frameWrap.appendChild(frame);
    }

    function setView(isMobile) {
      stage.classList.toggle('is-mobile', isMobile);
      btnMobile.classList.toggle('is-active', isMobile);
      btnDesktop.classList.toggle('is-active', !isMobile);
    }

    function openModal(url, label) {
      currentUrl = url;
      lastFocused = document.activeElement;
      titleEl.textContent = 'Live-Demo · ' + label;
      // Full-bleed iframe: on phones the demo renders its own mobile layout;
      // the desktop/mobile toggle is only offered on wider screens.
      setView(false);
      buildFrame();
      document.body.classList.add('demo-open');
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      window.requestAnimationFrame(function () {
        closeBtn.focus();
      });
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('demo-open');
      window.setTimeout(function () {
        frameWrap.innerHTML = '';
        currentUrl = '';
      }, 360);
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var url = card.getAttribute('data-demo-url');
        var label = card.getAttribute('data-demo-title') || 'Demo';
        if (url) openModal(url, label);
      });
    });

    closeBtn.addEventListener('click', closeModal);
    btnDesktop.addEventListener('click', function () { setView(false); });
    btnMobile.addEventListener('click', function () { setView(true); });

    modal.addEventListener('click', function (event) {
      if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  window.addEventListener('load', updateAnchorOffset);
  var anchorOffsetDebounceId = null;
  window.addEventListener('resize', function () {
    if (anchorOffsetDebounceId) window.clearTimeout(anchorOffsetDebounceId);
    anchorOffsetDebounceId = window.setTimeout(updateAnchorOffset, 100);
  });
  window.addEventListener('load', initMobileHeaderBehavior);
  window.addEventListener('load', initDesktopNavDropdownHover);
  window.addEventListener('load', highlightActiveNavLink);
  window.addEventListener('load', initAnalyticsConsent);
  enableTouchSectionGlow();
  initScrollReveal();
  initScrollProgress();
  initDemoLightbox();
})();
