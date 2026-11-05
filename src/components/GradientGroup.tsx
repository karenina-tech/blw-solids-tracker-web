'use client';

import { useLayoutEffect, useRef } from 'react';

/**
 * Makes every `[data-sheet]` element inside it show a slice of ONE shared gradient.
 * The gradient spans the box that contains all of those elements (cards, language buttons, ...).
 * It sets --gw/--gh (shared box size) and --gx/--gy (each element's offset inside it);
 * `.sheet-gradient` turns those into its background size and position.
 */
export function GradientGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const group = ref.current;
    if (!group) return;

    const apply = () => {
      const sheets = Array.from(group.querySelectorAll<HTMLElement>('[data-sheet]'));
      if (sheets.length === 0) return;

      const rects = sheets.map((el) => el.getBoundingClientRect());
      const left = Math.min(...rects.map((r) => r.left));
      const top = Math.min(...rects.map((r) => r.top));
      const right = Math.max(...rects.map((r) => r.right));
      const bottom = Math.max(...rects.map((r) => r.bottom));

      sheets.forEach((el, i) => {
        el.style.setProperty('--gw', `${right - left}px`);
        el.style.setProperty('--gh', `${bottom - top}px`);
        el.style.setProperty('--gx', `${rects[i].left - left}px`);
        el.style.setProperty('--gy', `${rects[i].top - top}px`);
      });
    };

    apply();
    const resize = new ResizeObserver(apply);
    resize.observe(group);
    group.querySelectorAll('[data-sheet]').forEach((el) => resize.observe(el));
    const mutation = new MutationObserver(() => {
      apply();
      group.querySelectorAll('[data-sheet]').forEach((el) => resize.observe(el));
    });
    mutation.observe(group, { childList: true, subtree: true });

    return () => {
      resize.disconnect();
      mutation.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
