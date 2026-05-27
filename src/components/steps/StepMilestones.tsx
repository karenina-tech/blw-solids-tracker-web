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
  label: string;
  description: string;
  informationalOnly?: boolean;
}[] = [
  {
    key: 'headControl',
    label: 'Head control',
    description: 'Baby can hold their head steady and upright without support.',
  },
  {
    key: 'canSitWithMinimalSupport',
    label: 'Sits with minimal support',
    description: 'Baby can sit upright with only a little help from you.',
  },
  {
    key: 'reachAndGrab',
    label: 'Reaches and grabs',
    description: 'Baby actively reaches for objects and brings them to their mouth.',
  },
  {
    key: 'showsInterestInFood',
    label: 'Shows interest in food',
    description: 'Baby watches you eat, opens their mouth, or grabs for food.',
    informationalOnly: true,
  },
];

export function StepMilestones({ milestones, onChange, onNext, onBack }: StepMilestonesProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Physical readiness</h2>
      <p className="text-slate-500 text-sm mb-6">
        Check everything that applies to your baby right now.
      </p>

      <div className="space-y-2">
        {MILESTONE_FIELDS.map(({ key, label, description, informationalOnly }) => (
          <label
            key={key}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer select-none"
          >
            <input
              type="checkbox"
              checked={milestones[key]}
              onChange={(e) => onChange(key, e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-800">{label}</span>
                {informationalOnly && (
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    optional
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            </div>
          </label>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-4">
        The first three markers are safety requirements. "Shows interest" is informational only.
      </p>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onBack}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-7 rounded-lg transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
