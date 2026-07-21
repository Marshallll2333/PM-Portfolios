const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}

const visitCount = document.getElementById('busuanzi_container_page_pv');
const visitCountValue = document.getElementById('busuanzi_value_page_pv');
const localHosts = new Set(['localhost', '127.0.0.1', '[::1]']);
const isLocalPreview = localHosts.has(window.location.hostname) || window.location.protocol === 'file:';

if (visitCount) {
  if (isLocalPreview) {
    visitCount.textContent = '本地预览 · 访问量仅在线上统计';
    visitCount.classList.add('ready', 'is-local');
  } else {
    const counterScript = document.createElement('script');
    counterScript.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    counterScript.async = true;
    document.body.appendChild(counterScript);

    let attempts = 0;
    const revealCounter = window.setInterval(() => {
      attempts += 1;

      if (visitCountValue?.textContent.trim()) {
        visitCount.classList.add('ready');
        window.clearInterval(revealCounter);
      } else if (attempts >= 16) {
        visitCount.textContent = '访问量统计暂不可用';
        visitCount.classList.add('ready');
        window.clearInterval(revealCounter);
      }
    }, 500);
  }
}

const resumeModal = document.getElementById('resume-modal');
const modalContent = resumeModal?.querySelector('.modal-content');
const resumeTriggers = [...document.querySelectorAll('[data-resume-trigger]')];
const modalCloseControls = [...document.querySelectorAll('[data-modal-close]')];
let lastFocusedElement = null;

const closeResumeModal = () => {
  if (!resumeModal || resumeModal.classList.contains('hidden')) {
    return;
  }

  resumeModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
  lastFocusedElement?.focus();
};

const openResumeModal = (trigger) => {
  if (!resumeModal) {
    return;
  }

  lastFocusedElement = trigger;
  resumeModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => modalContent?.focus());
};

resumeTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openResumeModal(trigger);
  });
});

modalCloseControls.forEach((control) => {
  control.addEventListener('click', closeResumeModal);
});

resumeModal?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeResumeModal();
    return;
  }

  if (event.key !== 'Tab') {
    return;
  }

  const focusableElements = [
    ...resumeModal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ];

  if (!focusableElements.length) {
    event.preventDefault();
    modalContent?.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
});

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

const closeNavMenu = () => {
  if (!navToggle || !navMenu) {
    return;
  }

  navMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.textContent = '菜单';
};

navToggle?.addEventListener('click', () => {
  if (!navMenu) {
    return;
  }

  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.textContent = isOpen ? '关闭' : '菜单';
});

navMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeNavMenu);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeNavMenu();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) {
    closeNavMenu();
  }
});
