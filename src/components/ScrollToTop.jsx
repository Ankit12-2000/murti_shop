import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const STORAGE_KEY = 'scroll_pos';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const prevPath = useRef(pathname);

  // Save scroll position on scroll (debounced)
  const saveScroll = useCallback(() => {
    const data = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
    data[pathname] = window.scrollY;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [pathname]);

  useEffect(() => {
    let timer;
    const handleScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(saveScroll, 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [saveScroll]);

  // Page transition animation
  useEffect(() => {
    const app = document.querySelector('.app');
    if (!app) return;

    if (prevPath.current === pathname) {
      prevPath.current = pathname;
      restoreScroll();
      return;
    }

    // Fade out
    app.style.opacity = '0';
    app.style.transform = navType === 'POP' ? 'translateX(-12px)' : 'translateX(12px)';
    app.style.transition = 'opacity 0.15s ease, transform 0.15s ease';

    prevPath.current = pathname;

    // After fade out, scroll + fade in
    setTimeout(() => {
      if (navType === 'POP') {
        restoreScroll();
      } else {
        window.scrollTo(0, 0);
      }

      // Fade in
      app.style.transform = navType === 'POP' ? 'translateX(12px)' : 'translateX(-12px)';
      requestAnimationFrame(() => {
        app.style.opacity = '1';
        app.style.transform = 'translateX(0)';
        app.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      });
    }, 150);

  }, [pathname, navType]);

  const restoreScroll = () => {
    const data = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
    const savedY = data[pathname];
    if (savedY == null || savedY === 0) return;

    let attempts = 0;
    const tryRestore = () => {
      if (attempts >= 20) return;
      attempts++;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll >= savedY) {
        window.scrollTo(0, savedY);
      } else {
        setTimeout(tryRestore, 150);
      }
    };
    setTimeout(tryRestore, 50);
  };

  return null;
};

export default ScrollToTop;
