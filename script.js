const burger = document.querySelector('.burger');
const mobileMenu = document.getElementById('mobileMenu');

const closeMenu = (returnFocus = false) => {
  if (!burger || !mobileMenu) {
    return;
  }

  burger.classList.remove('is-active');
  burger.setAttribute('aria-expanded', 'false');
  mobileMenu.hidden = true;

  if (returnFocus) {
    burger.focus();
  }
};

const openMenu = () => {
  if (!burger || !mobileMenu) {
    return;
  }

  burger.classList.add('is-active');
  burger.setAttribute('aria-expanded', 'true');
  mobileMenu.hidden = false;

  const focusable = mobileMenu.querySelector('a, button');
  if (focusable instanceof HTMLElement) {
    focusable.focus();
  }
};

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    if (mobileMenu.hidden) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  mobileMenu.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement && target.getAttribute('href')?.startsWith('#')) {
      closeMenu(true);
    }
  });

  const mediaQuery = window.matchMedia('(min-width: 769px)');
  const handleChange = (event) => {
    if (event.matches) {
      closeMenu();
    }
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
  } else {
    mediaQuery.addListener(handleChange);
  }
}
