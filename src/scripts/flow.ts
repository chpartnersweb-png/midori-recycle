const journey = document.querySelector<HTMLElement>('[data-flow-journey]');

if (journey && 'IntersectionObserver' in window) {
  const steps = Array.from(journey.querySelectorAll<HTMLElement>('[data-flow-step]'));
  const replay = journey.querySelector<HTMLButtonElement>('[data-flow-replay]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 801px)');
  const visible = new Set<HTMLElement>();
  let replayFrame = 0;

  const reveal = (targets: HTMLElement[]) => {
    const pending = steps.filter(step => targets.includes(step) && !step.classList.contains('is-revealed'));
    pending.forEach((step, order) => {
      step.style.setProperty('--flow-delay', `${motion.matches ? 0 : order * (desktop.matches ? 0.85 : 0.65)}s`);
      step.classList.add('is-revealed');
    });
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const step = entry.target as HTMLElement;
      if (entry.isIntersecting) visible.add(step);
      else visible.delete(step);
    });
    reveal(Array.from(visible));
  }, { threshold: 0.35, rootMargin: '0px 0px -6% 0px' });

  const applyMotionPreference = () => {
    journey.classList.toggle('is-enhanced', !motion.matches);
    if (replay) replay.hidden = motion.matches;
  };

  applyMotionPreference();
  steps.forEach(step => observer.observe(step));
  motion.addEventListener('change', applyMotionPreference);

  replay?.addEventListener('click', () => {
    if (motion.matches) return;
    cancelAnimationFrame(replayFrame);
    steps.forEach(step => step.classList.remove('is-revealed'));
    // A separate painted frame restarts the CSS animation without moving the page.
    replayFrame = requestAnimationFrame(() => {
      replayFrame = requestAnimationFrame(() => reveal(Array.from(visible)));
    });
  });
}
