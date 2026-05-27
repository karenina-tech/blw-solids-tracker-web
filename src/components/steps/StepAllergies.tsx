import { FOOD_DATASET } from '../../data/foodDataset';

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
  const canProceed =
    knownAllergies === false || (knownAllergies === true && allergicFoods.length > 0);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Known allergies</h2>
      <p className="text-slate-500 text-sm mb-6">
        We'll remove any allergens from the safe foods list.
      </p>

      <div className="space-y-3 mb-6">
        {[
          { value: false, label: 'No known allergies', description: 'Include all allergen foods in the plan.' },
          { value: true, label: 'Yes, there are known allergies', description: 'Select which foods to exclude.' },
        ].map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => onChangeKnownAllergies(opt.value)}
            className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
              knownAllergies === opt.value
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-slate-200 hover:border-emerald-300'
            }`}
          >
            <div
              className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                knownAllergies === opt.value ? 'border-emerald-600' : 'border-slate-300'
              }`}
            >
              {knownAllergies === opt.value && (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              )}
            </div>
            <div>
              <div className="font-semibold text-slate-800 text-sm">{opt.label}</div>
              <div className="text-slate-500 text-xs mt-0.5">{opt.description}</div>
            </div>
          </button>
        ))}
      </div>

      {knownAllergies === true && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">Select foods to exclude:</p>
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
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer flex-shrink-0"
                  />
                  <span className="text-sm text-slate-700">{food.name}</span>
                </label>
              );
            })}
          </div>
          {allergicFoods.length === 0 && (
            <p className="text-xs text-rose-500 mt-2">Select at least one allergen to exclude.</p>
          )}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 px-7 rounded-lg transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
