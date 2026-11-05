import { gsap } from 'gsap';

let mountedFaq: HTMLElement | null = null;
let cleanupFaq: (() => void) | undefined;

function enhanceItem(item: HTMLDetailsElement, motion: MediaQueryList) {
  const summary = item.querySelector<HTMLElement>('summary');
  const panel = item.querySelector<HTMLElement>('.faq-item__panel');
  const content = item.querySelector<HTMLElement>('.faq-item__answer');
  if (!summary || !panel || !content) return () => {};

  let expanded = item.open;
  let tween: gsap.core.Tween | undefined;
  let destination = 0;

  const syncState = () => {
    item.dataset.faqExpanded = String(expanded);
    summary.setAttribute('aria-expanded', String(expanded));
    // Native closed details already hide their contents. Only the visible
    // closing phase needs inert; leave normal find-in-page behavior intact.
    panel.inert = !expanded && item.open;
  };

  const settle = () => {
    tween?.kill();
    tween = undefined;
    item.open = expanded;
    panel.style.removeProperty('height');
    syncState();
  };

  const animate = (nextExpanded: boolean) => {
    // Capture the current rendered height before cancelling a running tween.
    // A rapid second click then reverses smoothly from that exact height.
    const currentHeight = item.open ? panel.getBoundingClientRect().height : 0;
    tween?.kill();
    tween = undefined;
    expanded = nextExpanded;
    syncState();

    if (motion.matches) {
      settle();
      return;
    }

    // Keep details open during both directions. On closing, its native content
    // hiding is deferred until the panel has actually reached zero height.
    panel.style.height = `${currentHeight}px`;
    if (!item.open) item.open = true;
    destination = expanded ? content.getBoundingClientRect().height : 0;

    if (Math.abs(destination - currentHeight) < 0.5) {
      settle();
      return;
    }

    tween = gsap.to(panel, {
      height: destination,
      duration: expanded ? 0.36 : 0.28,
      ease: 'power2.inOut',
      overwrite: 'auto',
      onComplete: () => {
        tween = undefined;
        item.open = expanded;
        // Return to natural height so later text wrapping never gets clipped.
        panel.style.removeProperty('height');
        syncState();
      },
    });
  };

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented) return;
    event.preventDefault();
    animate(!expanded);
  };

  const onToggle = () => {
    // Preserve native external changes, including browser find-in-page opening
    // a details element. Internal opening while a close tween runs is expected.
    if (tween && item.open) return;
    if (item.open !== expanded) {
      expanded = item.open;
      settle();
    }
  };

  const onMotionChange = () => {
    if (motion.matches) settle();
  };

  const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
    if (!tween || !expanded) return;
    if (Math.abs(content.getBoundingClientRect().height - destination) > 0.5) animate(true);
  }) : undefined;

  syncState();
  summary.addEventListener('click', onClick);
  item.addEventListener('toggle', onToggle);
  motion.addEventListener('change', onMotionChange);
  resize?.observe(content);

  return () => {
    summary.removeEventListener('click', onClick);
    item.removeEventListener('toggle', onToggle);
    motion.removeEventListener('change', onMotionChange);
    resize?.disconnect();
    settle();
    summary.removeAttribute('aria-expanded');
    delete item.dataset.faqExpanded;
    panel.inert = false;
  };
}

function disposeFaq() {
  cleanupFaq?.();
  cleanupFaq = undefined;
  mountedFaq = null;
}

function mountFaq() {
  const faq = document.querySelector<HTMLElement>('#faq');
  if (faq && faq === mountedFaq) return;
  disposeFaq();
  if (!faq) return;
  mountedFaq = faq;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const disposers = Array.from(faq.querySelectorAll<HTMLDetailsElement>('.faq-item'))
    .map(item => enhanceItem(item, motion));
  cleanupFaq = () => disposers.forEach(dispose => dispose());
}

mountFaq();
document.addEventListener('astro:page-load', mountFaq);
document.addEventListener('astro:before-swap', disposeFaq);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    disposeFaq();
    document.removeEventListener('astro:page-load', mountFaq);
    document.removeEventListener('astro:before-swap', disposeFaq);
  });
}
