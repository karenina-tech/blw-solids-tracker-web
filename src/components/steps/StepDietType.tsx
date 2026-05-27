type DietType = 'standard' | 'vegetarian' | 'vegan';

interface StepDietTypeProps {
  dietType: DietType | null;
  onChange: (value: DietType) => void;
  onNext: () => void;
  onBack: () => void;
}

const OPTIONS: { value: DietType; label: string; description: string }[] = [
  {
    value: 'standard',
    label: 'Standard',
    description: 'Includes all foods: meat, fish, dairy, and eggs.',
  },
  {
    value: 'vegetarian',
    label: 'Vegetarian',
    description: 'No meat or fish. Dairy and eggs are included.',
  },
  {
    value: 'vegan',
    label: 'Vegan',
    description: 'Plant-based only. No animal products.',
  },
];

export function StepDietType({ dietType, onChange, onNext, onBack }: StepDietTypeProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Your family's diet</h2>
      <p className="text-slate-500 text-sm mb-6">
        We'll filter the food list to match your family's eating preferences.
      </p>

      <div className="space-y-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
              dietType === opt.value
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-slate-200 hover:border-emerald-300'
            }`}
          >
            <div
              className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                dietType === opt.value ? 'border-emerald-600' : 'border-slate-300'
              }`}
            >
              {dietType === opt.value && (
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

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={dietType === null}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 px-7 rounded-lg transition-colors"
        >
          Generate plan →
        </button>
      </div>
    </div>
  );
}
