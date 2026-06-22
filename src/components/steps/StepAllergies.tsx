'use client';

import { useTranslation } from 'react-i18next';
import { FOOD_DATASET } from '@/data/foodDataset';

const ALLERGENS = FOOD_DATASET.filter((f) => f.category === 'Allergen');

interface StepAllergiesProps {
  knownAllergies: boolean | null;
  allergicFoods: string[];
  onChangeKnownAllergies: (value: boolean) => void;
  onToggleAllergen: (foodId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepAllergies({
  knownAllergies,
  allergicFoods,
  onChangeKnownAllergies,
  onToggleAllergen,
  onNext,
  onBack,
}: StepAllergiesProps) {
  const { t } = useTranslation();
  const canProceed =
    knownAllergies === false || (knownAllergies === true && allergicFoods.length > 0);

  const options = [
    {
      value: false,
      labelKey: 'steps.allergies.noAllergies.label',
      descriptionKey: 'steps.allergies.noAllergies.description',
    },
    {
      value: true,
      labelKey: 'steps.allergies.hasAllergies.label',
      descriptionKey: 'steps.allergies.hasAllergies.description',
    },
  ] as const;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">{t('steps.allergies.title')}</h2>
      <p className="text-slate-500 text-sm mb-6">{t('steps.allergies.subtitle')}</p>

      <div className="space-y-3 mb-6">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => onChangeKnownAllergies(opt.value)}
            className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
              knownAllergies === opt.value
                ? 'border-accent-600 bg-background'
                : 'border-slate-200 hover:border-accent-300'
            }`}
          >
            <div
              className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                knownAllergies === opt.value ? 'border-accent-600' : 'border-slate-300'
              }`}
            >
              {knownAllergies === opt.value && (
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

      {knownAllergies === true && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">{t('steps.allergies.selectFoods')}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {ALLERGENS.map((food) => {
              const selected = allergicFoods.includes(food.id);
              return (
                <label
                  key={food.id}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleAllergen(food.id)}
                    className="h-4 w-4 rounded border-slate-300 text-accent-600 focus:ring-accent-500 cursor-pointer shrink-0"
                  />
                  <span className="text-sm text-slate-700">{food.name}</span>
                </label>
              );
            })}
          </div>
          {allergicFoods.length === 0 && (
            <p className="text-xs text-rose-500 mt-2">{t('steps.allergies.selectAtLeastOne')}</p>
          )}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          {t('common.back')}
        </button>
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
