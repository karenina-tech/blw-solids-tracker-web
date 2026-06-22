'use client';

import { useTranslation } from 'react-i18next';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const { t } = useTranslation();
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-8">
      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
        <span>{t('common.stepOf', { current, total })}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className="bg-accent-100 h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
