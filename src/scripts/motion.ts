import { gsap } from 'gsap';

let mountedRoot: HTMLElement | null = null;
let cleanup: (() => void) | undefined;

// Animate independent blocks only. Interactive controls, hero content and the
// separate HOW IT WORKS sequence retain their own stable display behavior.
const revealSelector = [
  '.section-heading',
  '.concern',
  '.fee-message',
  '.item',
  '.service-overview__intro',
  '.service-row',
  '.result',
  '.other-results > article',
  '.area__heading',
  '.area__info',
  '.faq__heading',
  '.contact__inner > h2',
  '.contact__inner > p:not(.eyebrow)',
  '.company__inner > div',
].join(',');

function createReveals(root: HTMLElement, seen: WeakSet<HTMLElement>) {
  const context = gsap.context(() => {}, root);
  const pending = new Set<HTMLElement>();
  const active = new Map<HTMLElement, gsap.core.Tween>();
  const targets = Array.from(root.querySelectorAll<HTMLElement>(revealSelector));
  const order = new Map(targets.map((element, index) => [element, index]));
  let disposed = false;

  const finish = (element: HTMLElement) => {
    observer.unobserve(element);
    pending.delete(element);
    seen.add(element);
    const tween = active.get(element);
    if (tween) tween.totalProgress(1);
    else context.add(() => {
      gsap.set(element, { clearProps: 'transform,opacity' });
    });
    active.delete(element);
  };

  const observer = new IntersectionObserver(entries => {
    if (disposed) return;
    const entering = entries
      .filter(entry => entry.isIntersecting && pending.has(entry.target as HTMLElement))
      .sort((a, b) => (order.get(a.target as HTMLElement) ?? 0) - (order.get(b.target as HTMLElement) ?? 0));

    entering.forEach((entry, index) => {
      const element = entry.target as HTMLElement;
      // Stop observing before starting a transform so its changing bounds can
      // never start a second animation or change a stored scroll threshold.
      observer.unobserve(element);
      pending.delete(element);
      seen.add(element);

      if (element.contains(document.activeElement) || entry.boundingClientRect.bottom <= 0) {
        finish(element);
        return;
      }

      context.add(() => {
        const tween = gsap.to(element, {
          y: 0,
          opacity: 1,
          duration: 0.65,
          delay: Math.min(index * 0.06, 0.18),
          ease: 'power2.out',
          overwrite: 'auto',
          clearProps: 'transform,opacity',
          onComplete: () => { active.delete(element); },
        });
        active.set(element, tween);
      });
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  const finishOnFocus = (event: FocusEvent) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    const unfinished = new Set([...pending, ...active.keys()]);
    unfinished.forEach(element => {
      if (element.contains(target)) finish(element);
    });
  };

  const stop = () => {
    if (disposed) return;
    disposed = true;
    observer.disconnect();
    root.removeEventListener('focusin', finishOnFocus);
    // One context owns both preparation and playback. Reverting it once
    // restores the original styles, including blocks still below the fold.
    context.revert();
    pending.clear();
    active.clear();
  };

  try {
    // Measure all blocks before setting any styles. Anything already visible,
    // above the viewport, or keyboard-focused stays untouched and never replays.
    const viewportHeight = window.innerHeight;
    targets.forEach(element => {
      if (seen.has(element)) return;
      const bounds = element.getBoundingClientRect();
      if (bounds.height === 0 || bounds.top < viewportHeight + 12 || element.contains(document.activeElement)) {
        seen.add(element);
      } else {
        pending.add(element);
      }
    });

    if (pending.size) {
      context.add(() => {
        gsap.set(Array.from(pending), { opacity: 0, y: window.innerWidth > 800 ? 16 : 10 });
      });
      pending.forEach(element => observer.observe(element));
    }
    root.addEventListener('focusin', finishOnFocus);
  } catch (error) {
    // An initialization failure must leave the original page readable.
    stop();
    console.warn('表示アニメーションを停止しました。', error);
  }

  return stop;
}

function disposeMotion() {
  cleanup?.();
  cleanup = undefined;
  mountedRoot = null;
}

function mountMotion() {
  const root = document.querySelector<HTMLElement>('#main');
  if (root && root === mountedRoot) return;
  disposeMotion();
  if (!root || !('IntersectionObserver' in window)) return;
  mountedRoot = root;

  const seen = new WeakSet<HTMLElement>();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let stopReveals: (() => void) | undefined;

  const applyPreference = () => {
    stopReveals?.();
    stopReveals = undefined;
    if (reducedMotion.matches) {
      // Do not hide previously readable content if motion is enabled later.
      root.querySelectorAll<HTMLElement>(revealSelector).forEach(element => seen.add(element));
      return;
    }
    stopReveals = createReveals(root, seen);
  };

  cleanup = () => {
    reducedMotion.removeEventListener('change', applyPreference);
    stopReveals?.();
  };
  reducedMotion.addEventListener('change', applyPreference);
  applyPreference();
}

mountMotion();
document.addEventListener('astro:page-load', mountMotion);
document.addEventListener('astro:before-swap', disposeMotion);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    disposeMotion();
    document.removeEventListener('astro:page-load', mountMotion);
    document.removeEventListener('astro:before-swap', disposeMotion);
  });
}
