import { DatePicker } from '../DatePicker';

interface StepBabyInfoProps {
  name: string;
  startDate: string;
  onChange: (field: 'name' | 'startDate', value: string) => void;
  onNext: () => void;
}

export function StepBabyInfo({ name, startDate, onChange, onNext }: StepBabyInfoProps) {
  const canProceed = name.trim().length > 0 && startDate.length > 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Let's get started</h2>
      <p className="text-slate-500 text-sm mb-6">Tell us a little about your baby.</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Baby's name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g. Sofia"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Planned start date
          </label>
          <DatePicker value={startDate} onChange={(iso) => onChange('startDate', iso)} />
          <p className="text-xs text-slate-400 mt-1">This is used to generate your 30-day calendar.</p>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
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
