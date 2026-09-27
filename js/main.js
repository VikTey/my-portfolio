(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.site-nav');
  const navLinks = [...document.querySelectorAll('.site-nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const themeButton = document.querySelector('.theme-toggle');
  const root = document.documentElement;

  const setTheme = (theme, persist = false) => {
    const nextTheme = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    const switchTo = nextTheme === 'dark' ? 'light' : 'dark';
    themeButton?.setAttribute('aria-label', `Switch to ${switchTo} theme`);
    themeButton?.setAttribute('title', `Switch to ${switchTo} theme`);
    themeButton?.setAttribute('aria-pressed', String(nextTheme === 'light'));
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', nextTheme === 'dark' ? '#101615' : '#f4f0e6');
    if (persist) {
      try { localStorage.setItem('portfolio-theme', nextTheme); } catch { /* Theme still works when storage is unavailable. */ }
    }
  };

  setTheme(root.dataset.theme || 'dark');
  themeButton?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });

  document.querySelectorAll('.technology-item img, .tech-pill img').forEach((icon) => {
    icon.addEventListener('error', () => icon.remove(), { once: true });
  });

  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
    navigation?.classList.remove('open');
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation?.classList.toggle('open', !isOpen);
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
    document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const targetId = entry.target.id;
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${targetId}`;
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
          link.classList.toggle('active', active);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    document.querySelectorAll('.reveal').forEach((item) => item.classList.add('is-visible'));
  }

  const consoleCard = document.querySelector('.hero-console');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (consoleCard && finePointer && !reduceMotion) {
    consoleCard.addEventListener('pointermove', (event) => {
      const bounds = consoleCard.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      consoleCard.style.transform = `perspective(900px) rotateY(${x * 2.6}deg) rotateX(${-y * 2.2}deg)`;
    });
    consoleCard.addEventListener('pointerleave', () => {
      consoleCard.style.transform = '';
    });
  }

  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target === card) {
        event.preventDefault();
        card.classList.toggle('is-inspected');
      }
    });
    card.addEventListener('click', (event) => {
      if (event.target.closest('a, button, details, summary')) return;
      card.classList.toggle('is-inspected');
    });
  });
})();
