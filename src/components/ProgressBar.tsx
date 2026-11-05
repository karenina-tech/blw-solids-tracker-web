'use client';

import { useTranslation } from 'react-i18next';

interface ProgressBarProps {
  current: number;
  total: number;
}

const MINORS_PER_STEP = 3;

/**
 * A height-chart ruler: one long tick per step with short ticks between.
 * Ticks up to the current step are filled, so progress reads like a measurement.
 */
export function ProgressBar({ current, total }: ProgressBarProps) {
  const { t } = useTranslation();
  const ticks = Array.from({ length: (total - 1) * (MINORS_PER_STEP + 1) + 1 }, (_, i) => i);
  const filledUpTo = (current - 1) * (MINORS_PER_STEP + 1);

  return (
    <div className="mb-8" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current}>
      <p className="mb-3 font-mono text-sm font-medium text-accent-700">
        {t('common.stepOf', { current, total })}
      </p>
      <div className="flex items-end justify-between" aria-hidden="true">
        {ticks.map((i) => {
          const major = i % (MINORS_PER_STEP + 1) === 0;
          const filled = i <= filledUpTo;
          return (
            <span
              key={i}
              className={`block w-0.5 ${major ? 'h-5' : 'h-2.5'} ${filled ? 'bg-accent-700' : 'bg-slate-300'}`}
            />
          );
        })}
      </div>
      <div className="mt-1 flex justify-between font-mono text-sm" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`-mx-1 w-2 text-center ${i + 1 === current ? 'font-medium text-accent-700' : 'text-slate-400'}`}>
            {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}
