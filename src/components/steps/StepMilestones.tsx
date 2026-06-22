'use client';

import { useTranslation } from 'react-i18next';

type Milestones = {
  headControl: boolean;
  canSitWithMinimalSupport: boolean;
  reachAndGrab: boolean;
  showsInterestInFood: boolean;
};

interface StepMilestonesProps {
  milestones: Milestones;
  onChange: (field: keyof Milestones, value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

const MILESTONE_FIELDS: {
  key: keyof Milestones;
  labelKey: string;
  descriptionKey: string;
  informationalOnly?: boolean;
}[] = [
  {
    key: 'headControl',
    labelKey: 'steps.milestones.headControl.label',
    descriptionKey: 'steps.milestones.headControl.description',
  },
  {
    key: 'canSitWithMinimalSupport',
    labelKey: 'steps.milestones.sitting.label',
    descriptionKey: 'steps.milestones.sitting.description',
  },
  {
    key: 'reachAndGrab',
    labelKey: 'steps.milestones.reachAndGrab.label',
    descriptionKey: 'steps.milestones.reachAndGrab.description',
  },
  {
    key: 'showsInterestInFood',
    labelKey: 'steps.milestones.foodInterest.label',
    descriptionKey: 'steps.milestones.foodInterest.description',
    informationalOnly: true,
  },
];

export function StepMilestones({ milestones, onChange, onNext, onBack }: StepMilestonesProps) {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">{t('steps.milestones.title')}</h2>
      <p className="text-slate-500 text-sm mb-6">{t('steps.milestones.subtitle')}</p>

      <div className="space-y-2">
        {MILESTONE_FIELDS.map(({ key, labelKey, descriptionKey, informationalOnly }) => (
          <label
            key={key}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer select-none"
          >
            <input
              type="checkbox"
              checked={milestones[key]}
              onChange={(e) => onChange(key, e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 text-accent-600 focus:ring-accent-500 cursor-pointer shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-800">{t(labelKey)}</span>
                {informationalOnly && (
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    {t('common.optional')}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{t(descriptionKey)}</p>
            </div>
          </label>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-4">{t('steps.milestones.hint')}</p>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onBack}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          {t('common.back')}
        </button>
        <button
          onClick={onNext}
          className="bg-seed-600 hover:bg-seed-500 text-white font-semibold py-2.5 px-7 rounded-lg transition-colors"
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  );
}
