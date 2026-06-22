'use client';

import { useTranslation } from 'react-i18next';

const AGE_LABELS: Record<number, string> = {
  5: '5 mo', 6: '6 mo', 7: '7 mo', 8: '8 mo',
  9: '9 mo', 10: '10 mo', 11: '11 mo', 12: '12 mo',
};

interface StepAgeProps {
  ageMonths: number | null;
  onChange: (age: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepAge({ ageMonths, onChange, onNext, onBack }: StepAgeProps) {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">{t('steps.age.title')}</h2>
      <p className="text-slate-500 text-sm mb-6">{t('steps.age.subtitle')}</p>

      <div className="grid grid-cols-6 gap-2 mb-6">
        {Object.entries(AGE_LABELS).map(([month, label]) => {
          const m = Number(month);
          const isSelected = ageMonths === m;
          return (
            <button
              key={m}
              onClick={() => onChange(m)}
              className={`py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                isSelected
                  ? 'border-accent-600 bg-background text-accent-600'
                  : 'border-slate-200 text-slate-500 hover:border-accent-300 hover:text-accent-600'
              }`}
            >
              <span className="sm:hidden">{m}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>

      {ageMonths !== null && ageMonths < 5 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 mb-4">
          {t('steps.age.tooYoungWarning')}
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button
          onClick={onBack}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          {t('common.back')}
        </button>
        <button
          onClick={onNext}
          disabled={ageMonths === null}
          className="bg-seed-600 hover:bg-seed-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 px-7 rounded-lg transition-colors"
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  );
}
