'use client';

import { useTranslation } from 'react-i18next';
import { DatePicker } from '@/components/DatePicker';

const AGE_MONTHS = [5, 6, 7, 8, 9, 10, 11, 12] as const;

interface StepBabyInfoProps {
  name: string;
  startDate: string;
  ageMonths: number | null;
  onChange: (field: 'name' | 'startDate', value: string) => void;
  onChangeAge: (age: number) => void;
  onNext: () => void;
}

export function StepBabyInfo({ name, startDate, ageMonths, onChange, onChangeAge, onNext }: StepBabyInfoProps) {
  const { t } = useTranslation();
  const canProceed = name.trim().length > 0 && startDate.length > 0 && ageMonths !== null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">{t('steps.babyInfo.title')}</h2>
      <p className="text-slate-500 text-base mb-6">{t('steps.babyInfo.subtitle')}</p>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-base font-medium text-slate-700 mb-1.5">
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
          <label className="block text-base font-medium text-slate-700 mb-1.5">
            {t('steps.babyInfo.dateLabel')}
          </label>
          <DatePicker value={startDate} onChange={(iso) => onChange('startDate', iso)} />
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="block text-base font-medium text-slate-700">{t('steps.age.title')}</legend>
        <p className="text-slate-500 text-base mt-0.5 mb-3">{t('steps.age.subtitle')}</p>

        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {AGE_MONTHS.map((m) => {
            const isSelected = ageMonths === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => onChangeAge(m)}
                aria-pressed={isSelected}
                className={`py-3 rounded-lg border-2 text-base font-semibold transition-all ${
                  isSelected
                    ? 'border-accent-600 bg-background text-accent-600'
                    : 'border-slate-200 text-slate-500 hover:border-accent-300 hover:text-accent-600'
                }`}>
                {m} mo
              </button>
            );
          })}
        </div>

        {ageMonths !== null && ageMonths < 5 && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-base text-amber-800">
            {t('steps.age.tooYoungWarning')}
          </div>
        )}
      </fieldset>

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
