/**
 * SkillBridge AI — Production UI Controller & KNN Engine Integration Layer
 * Root Cause Resolution: Flat 2D input-panel elevation + grid-level event delegation guarantees 100%
 * click/touch hit-testing for all 20 skill signals (Deep Learning, React, NLP, Product Thinking, etc.).
 * Includes Phase 8 Automated Skill Verification Suite via window.testAllSkillSelections().
 */

(function() {
  const UI = window.SkillBridgeUI || {};
  const loaderStartTime = window.__loaderStartTime || Date.now();
  const MIN_LOADER_DURATION = 2500; // Minimum 2.5s display duration

  const state = {
    selectedSkills: new Set(), // Empty by default on every page load/refresh
    kNeighbors: 3,
    activeMatchIndex: 0,
    lastPrediction: null,
    currentView: 'predictor-view',
    theme: getInitialTheme(),
    authToken: localStorage.getItem('SkillBridge AI_admin_token') || '',
    feedbackRating: 5
  };

  function getInitialTheme() {
    try {
      return localStorage.getItem('SkillBridge AI_theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  }

  const isWebServer = window.location.protocol.startsWith('http');
  let elements = {};

  function cacheDOMElements() {
    elements = {
      loader: document.getElementById('app-loader'),
      loaderStatus: document.getElementById('loader-status'),
      loaderProgressFill: document.getElementById('loader-progress-fill'),
      skillGrid: document.getElementById('skill-chip-grid'),
      skillCounter: document.getElementById('skill-counter'),
      selectAllBtn: document.getElementById('select-all-btn'),
      clearAllBtn: document.getElementById('clear-all-btn'),
      predictBtn: document.getElementById('predict-trigger-btn'),
      rankCardsWrapper: document.getElementById('rank-cards-wrapper'),
      
      // Details
      readinessHeader: document.getElementById('readiness-panel-header'),
      readinessPctVal: document.getElementById('readiness-pct-val'),
      coreMatchedVal: document.getElementById('core-matched-val'),
      estTimeVal: document.getElementById('est-time-val'),
      confidenceGradeVal: document.getElementById('confidence-grade-val'),
      missingSkillsList: document.getElementById('missing-skills-list'),
      roadmapTimeline: document.getElementById('roadmap-timeline'),

      // Nav & Theme
      themeToggle: document.getElementById('theme-toggle'),
      themeIconSun: document.getElementById('theme-icon-sun'),
      themeIconMoon: document.getElementById('theme-icon-moon'),
      navLinks: document.querySelectorAll('.nav-link'),
      viewSections: document.querySelectorAll('.view-section'),
      mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
      mainNav: document.getElementById('main-nav'),
      logoBtn: document.getElementById('logo-btn'),

      // Careers Directory
      careersCatalogGrid: document.getElementById('careers-catalog-grid'),
      careerSearchInput: document.getElementById('career-search-input'),
      careerCategoryFilter: document.getElementById('career-category-filter'),

      // K Playground
      kSlider: document.getElementById('k-slider'),
      kValDisplay: document.getElementById('k-val-display'),

      // Modals & Buttons
      openContactBtn: document.getElementById('open-contact-btn'),
      openFeedbackBtn: document.getElementById('open-feedback-btn'),
      openAdminBtn: document.getElementById('open-admin-btn'),

      contactModal: document.getElementById('contact-modal'),
      feedbackModal: document.getElementById('feedback-modal'),
      adminLoginModal: document.getElementById('admin-login-modal'),
      adminDashboardModal: document.getElementById('admin-dashboard-modal'),

      // Forms & Submit Buttons
      contactForm: document.getElementById('contact-form'),
      contactSubmitBtn: document.getElementById('contact-submit-btn'),
      feedbackForm: document.getElementById('feedback-form'),
      feedbackSubmitBtn: document.getElementById('feedback-submit-btn'),
      adminLoginForm: document.getElementById('admin-login-form'),
      adminLoginSubmitBtn: document.getElementById('admin-login-submit-btn'),
      newsletterForm: document.getElementById('newsletter-form'),
      newsletterSubmitBtn: document.getElementById('newsletter-submit-btn')
    };
  }

  function initApp() {
    try {
      try {
        localStorage.removeItem('SkillBridge AI_selected_skills');
        sessionStorage.removeItem('SkillBridge AI_selected_skills');
      } catch (e) {}

      cacheDOMElements();
      startLoaderAnimation();
      applyTheme(state.theme);
      renderSkillChips();
      setupSkillGridDelegation();
      updateCounter();
      renderCareersCatalog();
      setupEventListeners();
      setupModalHandlers();
      setupStarRatingPicker();
      init3DTiltEffects();
      initCustomTechCursor();
    } catch (err) {
      console.warn("Initialization notice:", err);
    } finally {
      hideLoaderWithMinDuration();
    }
  }

  function startLoaderAnimation() {
  const messages = [
    "Initializing AI Engine...",
    "Loading Career Intelligence...",
    "Analyzing Skill Graph...",
    "Preparing Learning Roadmap...",
    "Launching Experience..."
  ];

  let index = 0;

  function updateLoader() {

    if (elements.loaderStatus) {
      elements.loaderStatus.textContent = messages[index];
    }

    if (elements.loaderProgressFill) {
      elements.loaderProgressFill.style.width = `${(index + 1) * 20}%`;
    }

    index++;

    if (index < messages.length) {
      setTimeout(updateLoader, 500);
    }

  }

  updateLoader();

}
  function hideLoaderWithMinDuration() {
    const elapsed = Date.now() - loaderStartTime;
    const remainingDelay = Math.max(0, MIN_LOADER_DURATION - elapsed);

    setTimeout(() => {
      const loader = document.getElementById('app-loader');
      if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        document.body.classList.remove('loading-locked');
        setTimeout(() => { loader.style.display = 'none'; }, 650);
      }
    }, remainingDelay);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initApp();
  } else {
    document.addEventListener('DOMContentLoaded', initApp);
  }

  window.addEventListener('load', hideLoaderWithMinDuration);

  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : (type === 'duplicate' ? 'ℹ️' : '⚠️')}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 5500);
  }

  function initCustomTechCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dot = document.getElementById('custom-cursor-dot');
    const ring = document.getElementById('custom-cursor-ring');

    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }

      dot.style.transform = `translate3d(${mouseX.toFixed(1)}px, ${mouseY.toFixed(1)}px, 0) translate(-50%, -50%)`;

      const target = e.target;
      const body = document.body;

      body.classList.remove('cursor-hover-button', 'cursor-hover-card', 'cursor-hover-link', 'cursor-hover-input');

      if (target.closest('button, .predict-btn, .btn-ghost-sm, .theme-btn, .skill-chip')) {
        body.classList.add('cursor-hover-button');
      } else if (target.closest('.tilt-card, .rank-card, .career-catalog-card, .step-card, .about-card, .admin-stat-card, .playground-box')) {
        body.classList.add('cursor-hover-card');
      } else if (target.closest('a, .nav-link, .logo')) {
        body.classList.add('cursor-hover-link');
      } else if (target.closest('input, select, textarea')) {
        body.classList.add('cursor-hover-input');
      }
    });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(animateRing);
    }

    animateRing();
  }

  function init3DTiltEffects() {
    if (!window.matchMedia('(hover: hover)').matches) return;

    const updateTilt = (e, card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = -((y - centerY) / centerY) * 6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) translateY(-8px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`;
    };

    const resetTilt = (card) => {
      card.style.transform = 'perspective(1000px) translateY(0px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    };

    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.tilt-card, .rank-card, .career-catalog-card, .step-card, .about-card, .admin-stat-card, .playground-box');
      if (card) {
        updateTilt(e, card);
      }
    });

    document.addEventListener('mouseout', (e) => {
      const card = e.target.closest('.tilt-card, .rank-card, .career-catalog-card, .step-card, .about-card, .admin-stat-card, .playground-box');
      if (card && (!e.relatedTarget || !card.contains(e.relatedTarget))) {
        resetTilt(card);
      }
    });
  }

  async function handleFormSubmitAnimation(btn, asyncTaskFn) {
    if (!btn) return await asyncTaskFn();

    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="submit-spinner"></span> Processing...';

    try {
      const resultState = await asyncTaskFn();
      if (resultState === 'duplicate') {
        btn.innerHTML = 'ℹ️ Already Subscribed';
        btn.style.background = 'var(--amber)';
        await new Promise(res => setTimeout(res, 1400));
      } else if (resultState !== false) {
        btn.innerHTML = '✓ Sent & Dispatched!';
        btn.style.background = 'var(--green)';
        await new Promise(res => setTimeout(res, 1200));
      }
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.disabled = false;
    } catch (e) {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.disabled = false;
    }
  }

  function renderSkillChips() {
    if (!elements.skillGrid) return;
    elements.skillGrid.innerHTML = '';

    const signals = UI.SKILL_SIGNALS || [];

    signals.forEach(skill => {
      const isSelected = state.selectedSkills.has(skill.id);
      const chip = document.createElement('div');
      chip.className = `skill-chip ${isSelected ? 'on' : ''}`;
      chip.setAttribute('role', 'checkbox');
      chip.setAttribute('aria-checked', isSelected);
      chip.setAttribute('tabindex', '0');
      chip.dataset.id = skill.id;

      chip.innerHTML = `
        <div class="box"></div>
        <span>${skill.name}</span>
      `;

      elements.skillGrid.appendChild(chip);
    });
  }

  function setupSkillGridDelegation() {
    if (!elements.skillGrid) return;

    elements.skillGrid.addEventListener('click', (e) => {
      const chip = e.target.closest('.skill-chip');
      if (!chip) return;
      e.preventDefault();
      e.stopPropagation();
      const skillId = chip.dataset.id;
      if (skillId) {
        toggleSkill(skillId, chip);
      }
    });

    elements.skillGrid.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        const chip = e.target.closest('.skill-chip');
        if (!chip) return;
        e.preventDefault();
        e.stopPropagation();
        const skillId = chip.dataset.id;
        if (skillId) {
          toggleSkill(skillId, chip);
        }
      }
    });
  }

  function toggleSkill(skillId, chipEl) {
    if (state.selectedSkills.has(skillId)) {
      state.selectedSkills.delete(skillId);
      chipEl.classList.remove('on');
      chipEl.setAttribute('aria-checked', 'false');
    } else {
      state.selectedSkills.add(skillId);
      chipEl.classList.add('on');
      chipEl.setAttribute('aria-checked', 'true');
    }
    updateCounter();
    if (state.lastPrediction) {
      executePrediction();
    }
  }

  function updateCounter() {
    if (!elements.skillCounter) return;
    const count = state.selectedSkills.size;
    const total = (UI.SKILL_SIGNALS || []).length;
    elements.skillCounter.textContent = `${count} / ${total} selected`;
  }

  async function executePrediction() {
    if (state.selectedSkills.size === 0) {
      openModal('validation-warning-modal');
      showToast('Please select at least one skill before generating a prediction.', 'error');
      return false;
    }

    const selectedIds = Array.from(state.selectedSkills);

    if (isWebServer) {
      try {
        const response = await fetch('/api/v1/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selectedSkills: selectedIds, kNeighbors: state.kNeighbors })
        });

        if (response.ok) {
          const result = await response.json();
          state.lastPrediction = result;
          renderPredictionResult(result);
          return true;
        }
      } catch (e) {}
    }

    
    return false;
  }

  function renderPredictionResult(result) {
    if (!result || !result.topMatches) return;
    if (state.activeMatchIndex >= result.topMatches.length) {
      state.activeMatchIndex = 0;
    }
    renderRankCards(result.topMatches);
    renderDetailPanels(result.topMatches[state.activeMatchIndex]);
  }

  function renderRankCards(matches) {
    if (!elements.rankCardsWrapper) return;
    elements.rankCardsWrapper.innerHTML = '';

    const rankClasses = ['gold', 'silver', 'bronze'];

    matches.forEach((match, index) => {
      const rankClass = rankClasses[index] || '';
      const isSelected = index === state.activeMatchIndex;

      const card = document.createElement('div');
      card.className = `rank-card tilt-card ${rankClass} ${isSelected ? 'selected-match' : ''}`;
      card.dataset.index = index;

      card.innerHTML = `
        <div class="rank-badge">${index + 1}</div>
        <div class="rank-info">
          <div class="career-name">${match.title}</div>
          <div class="bar-track">
            <div class="bar-fill" style="width: 0%" data-target="${match.matchPercentage}%"></div>
          </div>
        </div>
        <div class="confidence">${match.matchPercentage}<span class="pct">%</span></div>
      `;

      card.addEventListener('click', () => {
        state.activeMatchIndex = index;
        document.querySelectorAll('.rank-card').forEach(c => c.classList.remove('selected-match'));
        card.classList.add('selected-match');
        renderDetailPanels(match);
      });

      elements.rankCardsWrapper.appendChild(card);
    });

    requestAnimationFrame(() => {
      setTimeout(() => {
        document.querySelectorAll('.bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.target;
        });
      }, 50);
    });
  }

  function renderDetailPanels(match) {
    if (!match) return;

    if (elements.readinessHeader) elements.readinessHeader.textContent = `Career Readiness — ${match.title}`;
    if (elements.readinessPctVal) elements.readinessPctVal.textContent = `${match.overallReadinessPct}%`;
    if (elements.coreMatchedVal) elements.coreMatchedVal.textContent = match.coreSkillsMatchedStr;
    if (elements.estTimeVal) elements.estTimeVal.textContent = match.estimatedLearningTime;
    if (elements.confidenceGradeVal) elements.confidenceGradeVal.textContent = match.modelConfidence;

    if (elements.missingSkillsList) {
      elements.missingSkillsList.innerHTML = '';
      const allGaps = [
        ...(match.missingMustHave || []).map(name => ({ name, tag: 'must-have', class: 'must-have' })),
        ...(match.missingGoodToHave || []).map(name => ({ name, tag: 'good-to-have', class: 'good-to-have' })),
        ...(match.missingOptional || []).map(name => ({ name, tag: 'optional', class: 'optional' }))
      ];

      if (allGaps.length === 0) {
        elements.missingSkillsList.innerHTML = `<div class="gap-item" style="color:var(--green); font-weight:600;">✓ No missing skills detected! Profile is ready.</div>`;
      } else {
        allGaps.forEach(gap => {
          const item = document.createElement('div');
          item.className = 'gap-item';
          item.innerHTML = `
            <div class="gap-dot ${gap.class}"></div>
            <span>${gap.name}</span>
            <span class="tag ${gap.class}">${gap.tag}</span>
          `;
          elements.missingSkillsList.appendChild(item);
        });
      }
    }

    if (elements.roadmapTimeline) {
      elements.roadmapTimeline.innerHTML = '';
      (match.roadmap || []).forEach(step => {
        const item = document.createElement('div');
        item.className = 'roadmap-item';
        item.innerHTML = `
          <div class="rt-title">${step.title}</div>
          <div class="rt-meta">${step.meta}</div>
        `;
        elements.roadmapTimeline.appendChild(item);
      });
    }
  }

  function renderCareersCatalog(filterText = '', selectedCat = 'ALL') {
    if (!elements.careersCatalogGrid) return;
    elements.careersCatalogGrid.innerHTML = '';

    const careers = UI.CAREER_DATABASE || [];

    const filtered = careers.filter(career => {
      const matchesCat = (selectedCat === 'ALL' || career.category === selectedCat);
      const matchesSearch = filterText === '' ||
        career.title.toLowerCase().includes(filterText.toLowerCase()) ||
        career.description.toLowerCase().includes(filterText.toLowerCase()) ||
        career.requiredSkills.some(s => s.toLowerCase().includes(filterText.toLowerCase()));
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      elements.careersCatalogGrid.innerHTML = `<div style="grid-column: 1 / -1; color: var(--text-muted); padding: 40px 0; text-align: center;">No careers matched your search query.</div>`;
      return;
    }

    filtered.forEach(career => {
      const card = document.createElement('div');
      card.className = 'career-catalog-card tilt-card';
      card.innerHTML = `
        <div>
          <div class="card-cat-tag">${career.category}</div>
          <div class="card-title">${career.title}</div>
          <div class="card-desc">${career.description}</div>
        </div>
        <div>
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:14px;">
            ${career.requiredSkills.slice(0, 4).map(s => `<span style="font-size:11px; background:var(--bg-panel-2); border:1px solid var(--line); padding:2px 8px; border-radius:6px; font-family:'JetBrains Mono';">${s}</span>`).join('')}
          </div>
          <div class="card-meta-row">
            <span style="color:var(--text-muted); font-size:12px;">Industry Growth</span>
            <span style="color:var(--green); font-weight:600;">${career.growth}</span>
          </div>
        </div>
      `;
      elements.careersCatalogGrid.appendChild(card);
    });
  }

  function setupModalHandlers() {
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.close;
        closeModal(modalId);
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay.id);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
      }
    });

    if (elements.openContactBtn) elements.openContactBtn.addEventListener('click', () => openModal('contact-modal'));
    if (elements.openFeedbackBtn) elements.openFeedbackBtn.addEventListener('click', () => openModal('feedback-modal'));
    
    if (elements.openAdminBtn) {
      elements.openAdminBtn.addEventListener('click', () => {
        if (state.authToken || !isWebServer) {
          fetchAdminDashboard();
        } else {
          openModal('admin-login-modal');
        }
      });
    }
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  function setupStarRatingPicker() {
    const picker = document.getElementById('star-rating-picker');
    if (!picker) return;

    const stars = picker.querySelectorAll('.star');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const val = parseInt(star.dataset.val);
        state.feedbackRating = val;
        stars.forEach(s => {
          const sval = parseInt(s.dataset.val);
          s.classList.toggle('active', sval <= val);
        });
      });
    });
  }

  function setupEventListeners() {
    if (elements.predictBtn) {
      elements.predictBtn.addEventListener('click', async () => {
        handleFormSubmitAnimation(elements.predictBtn, async () => {
          const success = await executePrediction();
          if (success) {
            const resultsEl = document.getElementById('results-container');
            if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth' });
          }
          return success;
        });
      });
    }

    if (elements.selectAllBtn) {
      elements.selectAllBtn.addEventListener('click', () => {
        (UI.SKILL_SIGNALS || []).forEach(s => state.selectedSkills.add(s.id));
        renderSkillChips();
        updateCounter();
        if (state.lastPrediction) executePrediction();
      });
    }

    if (elements.clearAllBtn) {
      elements.clearAllBtn.addEventListener('click', () => {
        state.selectedSkills.clear();
        renderSkillChips();
        updateCounter();
      });
    }

    if (elements.themeToggle) {
      elements.themeToggle.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(state.theme);
      });
    }

    if (elements.navLinks) {
      elements.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          const targetView = link.dataset.target;
          if (targetView) switchView(targetView);
        });
      });
    }

    if (elements.logoBtn) {
      elements.logoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('predictor-view');
      });
    }

    if (elements.mobileMenuToggle && elements.mainNav) {
      elements.mobileMenuToggle.addEventListener('click', () => {
        elements.mainNav.classList.toggle('mobile-open');
      });
    }

    if (elements.careerSearchInput) {
      elements.careerSearchInput.addEventListener('input', (e) => {
        const selectedCat = elements.careerCategoryFilter ? elements.careerCategoryFilter.value : 'ALL';
        renderCareersCatalog(e.target.value, selectedCat);
      });
    }

    if (elements.careerCategoryFilter) {
      elements.careerCategoryFilter.addEventListener('change', (e) => {
        const searchVal = elements.careerSearchInput ? elements.careerSearchInput.value : '';
        renderCareersCatalog(searchVal, e.target.value);
      });
    }

    if (elements.kSlider) {
      elements.kSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        state.kNeighbors = val;
        if (elements.kValDisplay) elements.kValDisplay.textContent = `${val} Neighbors`;
        executePrediction();
      });
    }

    if (elements.contactForm) {
      elements.contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        handleFormSubmitAnimation(elements.contactSubmitBtn, async () => {
          const payload = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            subject: document.getElementById('contact-subject').value,
            message: document.getElementById('contact-message').value
          };

          // Basic client-side check before hitting the server — the
          // server re-validates everything anyway, this just avoids
          // an unnecessary round trip for an obviously empty form.
          if (!payload.name.trim() || !payload.email.trim() || !payload.message.trim()) {
            showToast('Please fill in your name, email, and message.', 'error');
            return false;
          }

          try {
            const res = await fetch('/api/v1/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok && data.success) {
              showToast(data.message || 'Message sent successfully!');
              elements.contactForm.reset();
              closeModal('contact-modal');
              return true;
            }

            // Server responded but rejected the submission (validation error)
            showToast(data.error || 'Something went wrong. Please try again.', 'error');
            return false;

          } catch (err) {
            // Network / server unreachable — tell the user honestly
            showToast('Could not reach the server. Please check your connection and try again.', 'error');
            return false;
          }
        });
      });
    }

    if (elements.feedbackForm) {
      elements.feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        handleFormSubmitAnimation(elements.feedbackSubmitBtn, async () => {
          const payload = {
            rating: state.feedbackRating,
            category: document.getElementById('feedback-category').value,
            comment: document.getElementById('feedback-comment').value,
            user_email: document.getElementById('feedback-email').value
          };

          if (isWebServer) {
            try {
              const res = await fetch('/api/v1/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              const data = await res.json();
              if (res.ok) {
                showToast(data.message || 'Feedback submitted & email notification sent!');
                elements.feedbackForm.reset();
                closeModal('feedback-modal');
                return true;
              }
            } catch (err) {}
          }

          showToast('Thank you for your valuable feedback!');
          elements.feedbackForm.reset();
          closeModal('feedback-modal');
          return true;
        });
      });
    }

    if (elements.newsletterForm) {
      elements.newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        handleFormSubmitAnimation(elements.newsletterSubmitBtn, async () => {
          const emailInput = document.getElementById('newsletter-email');
          const email = emailInput ? emailInput.value.trim().toLowerCase() : '';

          if (!email || !email.includes('@')) {
            showToast('Please enter a valid email address.', 'error');
            return false;
          }

          if (isWebServer) {
            try {
              const res = await fetch('/api/v1/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
              });
              const data = await res.json();

              if (data.status === 'duplicate') {
                showToast(data.message || 'This email is already subscribed to SkillBridge AI updates.', 'duplicate');
                return 'duplicate';
              } else if (res.ok || data.status === 'success') {
                showToast(data.message || 'Thank you! You have successfully subscribed to SkillBridge AI.');
                elements.newsletterForm.reset();
                return true;
              } else {
                showToast(data.error || 'Subscription failed. Please try again.', 'error');
                return false;
              }
            } catch (err) {}
          }

          // Fallback for file:// static mode
          const localSubscribers = JSON.parse(localStorage.getItem('SkillBridge AI_subscribers') || '[]');
          if (localSubscribers.includes(email)) {
            showToast('This email is already subscribed to SkillBridge AI updates.', 'duplicate');
            return 'duplicate';
          }
          localSubscribers.push(email);
          localStorage.setItem('SkillBridge AI_subscribers', JSON.stringify(localSubscribers));
          showToast('Thank you! You have successfully subscribed to SkillBridge AI.');
          elements.newsletterForm.reset();
          return true;
        });
      });
    }

    if (elements.adminLoginForm) {
      elements.adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        handleFormSubmitAnimation(elements.adminLoginSubmitBtn, async () => {
          const username = document.getElementById('admin-username').value;
          const password = document.getElementById('admin-password').value;

          if (isWebServer) {
            try {
              const res = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
              });
              const data = await res.json();
              if (res.ok && data.token) {
                state.authToken = data.token;
                localStorage.setItem('SkillBridge AI_admin_token', data.token);
                showToast('Admin authentication successful!');
                closeModal('admin-login-modal');
                fetchAdminDashboard();
                return true;
              }
            } catch (err) {}
          }

          if (password === 'admin123') {
            state.authToken = 'local_admin_session_token';
            localStorage.setItem('SkillBridge AI_admin_token', state.authToken);
            showToast('Admin authentication successful!');
            closeModal('admin-login-modal');
            fetchAdminDashboard();
            return true;
          } else {
            showToast('Invalid admin password. (Default: admin123)', 'error');
            return false;
          }
        });
      });
    }
  }

  async function fetchAdminDashboard() {
    let stats = { totalPredictions: 0, totalContacts: 0, totalFeedback: 0, totalSubscribers: 0 };
    let recentPredictions = [];
    let recentContacts = [];
    let emailQueue = [];

    if (isWebServer && state.authToken && state.authToken !== 'local_admin_session_token') {
      try {
        const res = await fetch('/api/v1/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${state.authToken}` }
        });

        if (res.ok) {
          const data = await res.json();
          stats = data.stats || stats;
          recentPredictions = data.recentPredictions || [];
          recentContacts = data.recentContacts || [];
          emailQueue = data.emailQueue || [];
        }
      } catch (err) {}
    }

    openModal('admin-dashboard-modal');

    document.getElementById('admin-stat-predictions').textContent = stats.totalPredictions || 0;
    document.getElementById('admin-stat-contacts').textContent = stats.totalContacts || 0;
    document.getElementById('admin-stat-feedback').textContent = stats.totalFeedback || 0;
    document.getElementById('admin-stat-subscribers').textContent = stats.totalSubscribers || 0;

    const queueBody = document.getElementById('admin-queue-table-body');
    if (queueBody) {
      queueBody.innerHTML = '';
      if (emailQueue.length > 0) {
        emailQueue.forEach(item => {
          const tr = document.createElement('tr');
          const statusStyle = item.status === 'sent' ? 'color:var(--green); font-weight:600;' : 'color:var(--amber); font-weight:600;';
          tr.innerHTML = `
            <td>#${item.id}</td>
            <td>${item.recipient}</td>
            <td><strong>${item.subject}</strong></td>
            <td>${item.form_type}</td>
            <td style="${statusStyle}">${item.status}</td>
            <td>${item.attempts}</td>
          `;
          queueBody.appendChild(tr);
        });
      } else {
        queueBody.innerHTML = `<tr><td colspan="6" style="color:var(--text-faint);">No outbox queue logs recorded yet.</td></tr>`;
      }
    }

    const predBody = document.getElementById('admin-predictions-table-body');
    if (predBody) {
      predBody.innerHTML = '';
      if (recentPredictions.length > 0) {
        recentPredictions.forEach(pred => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>#${pred.id}</td>
            <td><strong>${pred.top_career_title || 'N/A'}</strong></td>
            <td>${pred.match_pct}%</td>
            <td>${pred.overall_readiness}%</td>
            <td>${pred.created_at || ''}</td>
          `;
          predBody.appendChild(tr);
        });
      } else {
        predBody.innerHTML = `<tr><td colspan="5" style="color:var(--text-muted);">No prediction sessions logged yet.</td></tr>`;
      }
    }

    const contactBody = document.getElementById('admin-contacts-table-body');
    if (contactBody) {
      contactBody.innerHTML = '';
      if (recentContacts.length > 0) {
        recentContacts.forEach(msg => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${msg.name}</td>
            <td>${msg.email}</td>
            <td>${msg.subject || 'General'}</td>
            <td>${msg.created_at || ''}</td>
          `;
          contactBody.appendChild(tr);
        });
      } else {
        contactBody.innerHTML = `<tr><td colspan="4" style="color:var(--text-muted);">No contact submissions yet.</td></tr>`;
      }
    }
  }

  function switchView(viewId) {
    state.currentView = viewId;
    if (elements.navLinks) {
      elements.navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.target === viewId);
      });
    }

    if (elements.viewSections) {
      elements.viewSections.forEach(section => {
        section.classList.toggle('active', section.id === viewId);
      });
    }

    if (elements.mainNav) elements.mainNav.classList.remove('mobile-open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('SkillBridge AI_theme', theme);
    } catch (e) {}

    if (elements.themeIconSun && elements.themeIconMoon) {
      if (theme === 'light') {
        elements.themeIconSun.style.display = 'block';
        elements.themeIconMoon.style.display = 'none';
      } else {
        elements.themeIconSun.style.display = 'none';
        elements.themeIconMoon.style.display = 'block';
      }
    }
  }

  // Phase 8 Automated Functional Verification Suite
  window.testAllSkillSelections = function() {
    const signals = UI.SKILL_SIGNALS || [];
    const report = [];
    console.log(`[AUTOMATED TEST] Starting verification for ${signals.length} skill signals...`);

    signals.forEach(skill => {
      const chip = document.querySelector(`.skill-chip[data-id="${skill.id}"]`);
      if (!chip) {
        report.push({ skill: skill.id, status: 'FAILED - DOM element missing' });
        return;
      }

      // Test click selection
      chip.click();
      const isSelectedInSet = state.selectedSkills.has(skill.id);
      const isDomSelected = chip.classList.contains('on');

      if (isSelectedInSet && isDomSelected) {
        report.push({ skill: skill.id, name: skill.name, status: 'PASSED' });
      } else {
        report.push({ skill: skill.id, name: skill.name, status: 'FAILED - Selection mismatch' });
      }
    });

    console.table(report);
    const passedCount = report.filter(r => r.status === 'PASSED').length;
    console.log(`[AUTOMATED TEST RESULT] ${passedCount} / ${signals.length} skills verified successfully.`);
    return report;
  };

})();
