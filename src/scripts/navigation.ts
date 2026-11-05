import { setScrollLocked } from './scroll';

let mountedHeader: HTMLElement | null = null;
let cleanupNavigation: (() => void) | undefined;

function disposeNavigation() {
  cleanupNavigation?.();
  cleanupNavigation = undefined;
  mountedHeader = null;
}

function mountNavigation() {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (header && header === mountedHeader) return;
  disposeNavigation();
  if (!header) return;
  mountedHeader = header;
  const removeListeners: Array<() => void> = [];
  let frame = 0;

  const updateHeader = () => {
    frame = 0;
    header.classList.toggle('is-scrolled', window.scrollY > 16);
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(updateHeader);
  };
  updateHeader();
  window.addEventListener('scroll', onScroll, { passive: true });
  removeListeners.push(() => window.removeEventListener('scroll', onScroll));

  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLDialogElement>('#mobile-menu');
  const close = menu?.querySelector<HTMLButtonElement>('[data-menu-close]');

  if (toggle && menu && close) {
    const releaseScroll = () => {
      toggle.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('menu-open');
      setScrollLocked(false);
    };
    const closeMenu = () => {
      if (menu.open) menu.close();
      // Unlock synchronously before a menu link reaches the anchor handler.
      releaseScroll();
    };
    const onToggle = () => {
      if (menu.open) return closeMenu();
      menu.showModal();
      toggle.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('menu-open');
      setScrollLocked(true);
    };
    const onClose = () => {
      if (menu.open) return;
      releaseScroll();
      toggle.focus({ preventScroll: true });
    };
    const onCancel = (event: Event) => {
      event.preventDefault();
      closeMenu();
    };
    const onBackdropClick = (event: MouseEvent) => {
      const box = menu.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeMenu();
    };
    const desktop = window.matchMedia('(min-width: 1101px)');
    const onDesktop = () => { if (desktop.matches) closeMenu(); };

    toggle.addEventListener('click', onToggle);
    close.addEventListener('click', closeMenu);
    menu.addEventListener('close', onClose);
    menu.addEventListener('cancel', onCancel);
    menu.addEventListener('click', onBackdropClick);
    desktop.addEventListener('change', onDesktop);
    const links = Array.from(menu.querySelectorAll<HTMLAnchorElement>('a'));
    links.forEach(link => link.addEventListener('click', closeMenu));
    removeListeners.push(() => {
      toggle.removeEventListener('click', onToggle);
      close.removeEventListener('click', closeMenu);
      menu.removeEventListener('close', onClose);
      menu.removeEventListener('cancel', onCancel);
      menu.removeEventListener('click', onBackdropClick);
      desktop.removeEventListener('change', onDesktop);
      links.forEach(link => link.removeEventListener('click', closeMenu));
      closeMenu();
    });
  }

  cleanupNavigation = () => {
    cancelAnimationFrame(frame);
    removeListeners.forEach(remove => remove());
    header.classList.remove('is-scrolled');
  };
}

mountNavigation();
document.addEventListener('astro:page-load', mountNavigation);
document.addEventListener('astro:before-swap', disposeNavigation);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    disposeNavigation();
    document.removeEventListener('astro:page-load', mountNavigation);
    document.removeEventListener('astro:before-swap', disposeNavigation);
  });
}
