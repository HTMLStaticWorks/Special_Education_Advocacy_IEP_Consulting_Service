/* ==========================================================================
   Guided Path Advocacy - Special Education Advocacy & IEP Consulting
   Core JavaScript Application Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSystem();
  initRTLSystem();
  initStickyNavbar();
  initActiveNavLink();
  initFormValidations();
  initPasswordToggles();
  initResourceFiltering();
  initInsightsFiltering();
  initBackToTop();
  initGSAPAnimations();
});

/* ==========================================================================
   1. THEME MANAGER SYSTEM (LIGHT / DARK PERSISTENCE)
   ========================================================================== */
function initThemeSystem() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('gpa_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcons(currentTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('gpa_theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });
}

function updateThemeIcons(theme) {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'bi bi-sun-fill';
        btn.setAttribute('aria-label', 'Switch to light mode');
      } else {
        icon.className = 'bi bi-moon-stars-fill';
        btn.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
  });
}

/* ==========================================================================
   2. RTL DIRECTION CONTROLLER (RIGHT-TO-LEFT PERSISTENCE)
   ========================================================================== */
function initRTLSystem() {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const storedDir = localStorage.getItem('gpa_direction');
  const currentDir = storedDir || 'ltr';
  
  document.documentElement.setAttribute('dir', currentDir);
  updateRTLBtnText(currentDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = activeDir === 'rtl' ? 'ltr' : 'rtl';
      
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('gpa_direction', newDir);
      updateRTLBtnText(newDir);
    });
  });
}

function updateRTLBtnText(dir) {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  rtlToggleBtns.forEach(btn => {
    btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR direction' : 'Switch to RTL direction');
  });
}

/* ==========================================================================
   3. STICKY NAVBAR BEHAVIOR
   ========================================================================== */
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar-custom');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   4. ACTIVE NAV LINK HIGHLIGHTER
   ========================================================================== */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link-custom, .dropdown-item-custom');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      const parentDropdown = link.closest('.dropdown');
      if (parentDropdown) {
        const toggle = parentDropdown.querySelector('.nav-link-custom');
        if (toggle) toggle.classList.add('active');
      }
    }
  });
}

/* ==========================================================================
   5. FORM VALIDATION & INTERACTION HANDLERS
   ========================================================================== */
function initFormValidations() {
  // Contact Form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (contactForm.checkValidity()) {
        showFormNotice(contactForm, 'success', 'Thank you for reaching out. We have received your consultation enquiry and will be in touch within 1-2 business days.');
        contactForm.reset();
      } else {
        contactForm.classList.add('was-validated');
      }
    });
  }

  // Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail')?.value;
      const pass = document.getElementById('loginPassword')?.value;

      if (email && pass) {
        showFormNotice(loginForm, 'info', 'Demo Login Successful. (Note: Standalone front-end UI demonstration with no backend or dashboard redirect).');
      } else {
        showFormNotice(loginForm, 'danger', 'Please enter both your email address and password.');
      }
    });
  }

  // Signup Form
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pass = document.getElementById('signupPassword')?.value;
      const confirmPass = document.getElementById('signupConfirmPassword')?.value;
      const terms = document.getElementById('termsCheck')?.checked;

      if (!terms) {
        showFormNotice(signupForm, 'danger', 'Please accept the Terms of Service and Privacy Policy.');
        return;
      }

      if (pass !== confirmPass) {
        showFormNotice(signupForm, 'danger', 'Passwords do not match. Please verify your password entry.');
        return;
      }

      if (signupForm.checkValidity()) {
        showFormNotice(signupForm, 'success', 'Account creation demo complete. (Note: Standalone front-end demonstration only).');
        signupForm.reset();
      } else {
        signupForm.classList.add('was-validated');
      }
    });
  }

  // Forgot Password Form
  const forgotForm = document.getElementById('forgotPasswordForm');
  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('resetEmail')?.value;
      if (email) {
        showFormNotice(forgotForm, 'success', `A password reset instruction link has been dispatched to ${email}. Please check your inbox.`);
        forgotForm.reset();
      }
    });
  }
}

function showFormNotice(formEl, type, message) {
  let noticeContainer = formEl.querySelector('.form-notice');
  if (!noticeContainer) {
    noticeContainer = document.createElement('div');
    noticeContainer.className = 'form-notice mt-3';
    formEl.prepend(noticeContainer);
  }
  
  const iconClass = type === 'success' ? 'bi-check-circle-fill' : type === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill';
  noticeContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show d-flex align-items-center gap-2" role="alert">
      <i class="bi ${iconClass} fs-5"></i>
      <div>${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

/* ==========================================================================
   6. PASSWORD VISIBILITY TOGGLE
   ========================================================================== */
function initPasswordToggles() {
  const toggleBtns = document.querySelectorAll('.password-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = isPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill';
        }
      }
    });
  });
}

/* ==========================================================================
   7. RESOURCE HUB SEARCH & CATEGORY FILTER
   ========================================================================== */
function initResourceFiltering() {
  const searchInput = document.getElementById('resourceSearch');
  const filterBtns = document.querySelectorAll('[data-resource-filter]');
  const resourceCards = document.querySelectorAll('.resource-item-card');

  if (!resourceCards.length) return;

  function filterResources() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeFilterBtn = document.querySelector('[data-resource-filter].active');
    const activeCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-resource-filter') : 'all';

    resourceCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.card-text')?.textContent.toLowerCase() || '';

      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.parentElement.style.display = 'block';
      } else {
        card.parentElement.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterResources);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterResources();
    });
  });
}

/* ==========================================================================
   8. INSIGHTS / BLOG SEARCH & CATEGORY FILTER
   ========================================================================== */
function initInsightsFiltering() {
  const searchInput = document.getElementById('insightSearch');
  const filterBtns = document.querySelectorAll('[data-blog-filter]');
  const blogCards = document.querySelectorAll('.blog-item-card');

  if (!blogCards.length) return;

  function filterBlog() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeFilterBtn = document.querySelector('[data-blog-filter].active');
    const activeCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-blog-filter') : 'all';

    blogCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const title = card.querySelector('.blog-title')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('.blog-excerpt')?.textContent.toLowerCase() || '';

      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = title.includes(searchTerm) || excerpt.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.parentElement.style.display = 'block';
      } else {
        card.parentElement.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterBlog);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterBlog();
    });
  });
}

/* ==========================================================================
   9. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   11. INTERACTIVE IEP AUDIT READINESS SCORE CALCULATOR
   ========================================================================== */
function updateAuditScore() {
  const c1 = document.getElementById('checkCriterion1')?.checked;
  const c2 = document.getElementById('checkCriterion2')?.checked;
  const c3 = document.getElementById('checkCriterion3')?.checked;
  const c4 = document.getElementById('checkCriterion4')?.checked;

  const count = [c1, c2, c3, c4].filter(Boolean).length;
  const title = document.getElementById('auditStatusTitle');
  const desc = document.getElementById('auditStatusDesc');

  if (!title || !desc) return;

  if (count === 4) {
    title.innerHTML = '<i class="bi bi-check-circle-fill text-sage me-2"></i> Audit Readiness Score: 100% (Fully Verified)';
    desc.textContent = 'Great job! Your student document addresses key objective baselines, accommodations, and parent input.';
  } else if (count > 0) {
    title.innerHTML = `<i class="bi bi-shield-exclamation text-coral me-2"></i> Audit Readiness Score: ${count * 25}% (${4 - count} Gaps Identified)`;
    desc.textContent = 'Some essential sections are unverified. We recommend a 1-on-1 document review to address missing metrics before your next school meeting.';
  } else {
    title.innerHTML = '<i class="bi bi-search text-teal me-2"></i> Select the criteria above to assess your document readiness';
    desc.textContent = 'If any criteria are unverified or missing, our advocacy consultants can audit your paperwork line-by-line.';
  }
}
