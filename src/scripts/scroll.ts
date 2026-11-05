import Lenis from 'lenis';

let lenis: Lenis | undefined;
let locked = false;
let mountedRoot: HTMLElement | null = null;
let cleanupScroll: (() => void) | undefined;

export function setScrollLocked(value: boolean) {
  locked = value;
  if (locked) lenis?.stop();
  else lenis?.start();
}

function focusAnchor(target: HTMLElement) {
  const focusTarget = target === document.body
    ? document.querySelector<HTMLElement>('#hero-title') ?? target
    : target;
  const temporary = !focusTarget.hasAttribute('tabindex')
    && !focusTarget.matches('a[href], button, input, select, textarea, summary, [contenteditable="true"]');
  if (temporary) {
    focusTarget.setAttribute('tabindex', '-1');
    focusTarget.addEventListener('blur', () => focusTarget.removeAttribute('tabindex'), { once: true });
  }
  focusTarget.focus({ preventScroll: true });
}

function disposeScroll() {
  cleanupScroll?.();
  cleanupScroll = undefined;
  lenis = undefined;
  locked = false;
  mountedRoot = null;
}

function mountScroll() {
  if (mountedRoot === document.documentElement) return;
  disposeScroll();
  mountedRoot = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const applyPreference = () => {
    lenis?.destroy();
    lenis = undefined;
    if (reducedMotion.matches) return;
    lenis = new Lenis({
      autoRaf: true,
      autoResize: true,
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
    });
    if (locked) lenis.stop();
  };

  const onAnchorClick = (event: MouseEvent) => {
    if (!lenis || locked || event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const source = event.target;
    const anchor = source instanceof Element ? source.closest<HTMLAnchorElement>('a[href]') : null;
    if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname
      || url.search !== window.location.search || !url.hash) return;

    let id: string;
    try { id = decodeURIComponent(url.hash.slice(1)); }
    catch { return; }
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    if (window.location.hash !== url.hash) window.history.pushState(window.history.state, '', url.hash);

    // Lenis 1.3.27 reads the root's scroll-padding-top itself. Use the same
    // CSS value for native links and smooth links instead of doubling offsets.
    lenis.scrollTo(target, {
      immediate: anchor.classList.contains('skip-link'),
      onComplete: () => {
        if (target.isConnected && window.location.hash === url.hash) focusAnchor(target);
      },
    });
  };

  reducedMotion.addEventListener('change', applyPreference);
  document.addEventListener('click', onAnchorClick);
  cleanupScroll = () => {
    reducedMotion.removeEventListener('change', applyPreference);
    document.removeEventListener('click', onAnchorClick);
    lenis?.destroy();
  };
  applyPreference();
}

mountScroll();
document.addEventListener('astro:page-load', mountScroll);
document.addEventListener('astro:before-swap', disposeScroll);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    disposeScroll();
    document.removeEventListener('astro:page-load', mountScroll);
    document.removeEventListener('astro:before-swap', disposeScroll);
  });
}
