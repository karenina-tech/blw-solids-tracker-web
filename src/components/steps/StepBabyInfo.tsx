'use client';

import { useTranslation } from 'react-i18next';
import { DatePicker } from '@/components/DatePicker';

interface StepBabyInfoProps {
  name: string;
  startDate: string;
  onChange: (field: 'name' | 'startDate', value: string) => void;
  onNext: () => void;
}

export function StepBabyInfo({ name, startDate, onChange, onNext }: StepBabyInfoProps) {
  const { t } = useTranslation();
  const canProceed = name.trim().length > 0 && startDate.length > 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">{t('steps.babyInfo.title')}</h2>
      <p className="text-slate-500 text-sm mb-6">{t('steps.babyInfo.subtitle')}</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {t('steps.babyInfo.nameLabel')}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder={t('steps.babyInfo.namePlaceholder')}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {t('steps.babyInfo.dateLabel')}
          </label>
          <DatePicker value={startDate} onChange={(iso) => onChange('startDate', iso)} />
          <p className="text-xs text-slate-400 mt-1">{t('steps.babyInfo.dateHint')}</p>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-seed-600 hover:bg-seed-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 px-7 rounded-lg transition-colors"
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  );
}
