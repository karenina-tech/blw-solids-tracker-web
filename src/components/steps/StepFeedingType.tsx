'use client';

import { useTranslation } from 'react-i18next';

type FeedingType = 'formula' | 'exclusive_breastfeeding';

interface StepFeedingTypeProps {
  feedingType: FeedingType | undefined;
  onChange: (value: FeedingType) => void;
  onNext: () => void;
  onBack: () => void;
}

const OPTIONS: { value: FeedingType; labelKey: string; descriptionKey: string }[] = [
  {
    value: 'formula',
    labelKey: 'steps.feedingType.formula.label',
    descriptionKey: 'steps.feedingType.formula.description',
  },
  {
    value: 'exclusive_breastfeeding',
    labelKey: 'steps.feedingType.breastfeeding.label',
    descriptionKey: 'steps.feedingType.breastfeeding.description',
  },
];

export function StepFeedingType({ feedingType, onChange, onNext, onBack }: StepFeedingTypeProps) {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">{t('steps.feedingType.title')}</h2>
      <p className="text-slate-500 text-sm mb-6">{t('steps.feedingType.subtitle')}</p>

      <div className="space-y-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
              feedingType === opt.value
                ? 'border-accent-600 bg-background'
                : 'border-slate-200 hover:border-accent-300'
            }`}
          >
            <div
              className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                feedingType === opt.value ? 'border-accent-600' : 'border-slate-300'
              }`}
            >
              {feedingType === opt.value && (
                <div className="w-2.5 h-2.5 rounded-full bg-accent-600" />
              )}
            </div>
            <div>
              <div className="font-semibold text-slate-800 text-sm">{t(opt.labelKey)}</div>
              <div className="text-slate-500 text-xs mt-0.5">{t(opt.descriptionKey)}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          {t('common.back')}
        </button>
        <button
          onClick={onNext}
          disabled={feedingType === undefined}
          className="bg-seed-600 hover:bg-seed-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 px-7 rounded-lg transition-colors"
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  );
}
