import { useState } from 'react';
import { FoodItemSchema } from '../schemas/foodDatasetSchema';
import { FOOD_DATASET } from '../data/foodDataset';
import { useSubmission } from '../hooks/useSubmission';
import { FoodCatalog } from './FoodCatalog';
import { Tooltip } from './Tooltip';

interface ContributeFormProps {
  workerUrl: string;
}

type FormFields = {
  id: string;
  name: string;
  category: 'Standard' | 'Allergen' | '';
  dietaryType: 'standard' | 'vegetarian' | 'vegan' | '';
  prep6_9: string;
  prep9_12: string;
  chokingHazardWarning: string;
  submitterNotes: string;
};

const EMPTY: FormFields = {
  id: '',
  name: '',
  category: '',
  dietaryType: '',
  prep6_9: '',
  prep9_12: '',
  chokingHazardWarning: '',
  submitterNotes: '',
};

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildEntry(f: FormFields) {
  const preparationByAge: Record<string, string> = {};
  if (f.prep6_9.trim()) preparationByAge['6-9'] = f.prep6_9.trim();
  if (f.prep9_12.trim()) preparationByAge['9-12'] = f.prep9_12.trim();

  return {
    id: f.id,
    name: f.name,
    category: f.category as 'Standard' | 'Allergen',
    minAgeMonths: 6,
    preparationByAge,
    dietaryType: f.dietaryType as 'standard' | 'vegetarian' | 'vegan',
    ...(f.chokingHazardWarning.trim() ? { chokingHazardWarning: f.chokingHazardWarning.trim() } : {}),
  };
}

const PREP_MIN = 20;
const PREP_MAX = 150;
const HAZARD_MIN = 30;
const HAZARD_MAX = 150;
const NOTES_MIN = 20;
const NOTES_MAX = 500;

const inputClass =
  'w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500';

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

export function ContributeForm({ workerUrl }: ContributeFormProps) {
  const [view, setView] = useState<'suggest' | 'browse'>('suggest');
  const [fields, setFields] = useState<FormFields>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { submission, submit, reset } = useSubmission(workerUrl);

  const set = (key: keyof FormFields, value: string) =>
    setFields((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'name' && !slugTouched) next.id = toSlug(value);
      return next;
    });

  const duplicateFood = fields.name.trim().length > 0
    ? FOOD_DATASET.find(
        (f) =>
          f.name.toLowerCase() === fields.name.trim().toLowerCase() ||
          f.id.toLowerCase() === fields.id.trim().toLowerCase()
      )
    : undefined;

  const validatePrepField = (value: string): string | undefined => {
    const len = value.trim().length;
    if (len === 0) return undefined;
    if (len < PREP_MIN) return `At least ${PREP_MIN} characters (${len}/${PREP_MIN})`;
    if (len > PREP_MAX) return `At most ${PREP_MAX} characters (${len}/${PREP_MAX})`;
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fields.dietaryType) errs.dietaryType = 'Please select a dietary type';

    const prep6_9Err = validatePrepField(fields.prep6_9);
    if (prep6_9Err) errs['prep6_9'] = prep6_9Err;
    const prep9_12Err = validatePrepField(fields.prep9_12);
    if (prep9_12Err) errs['prep9_12'] = prep9_12Err;

    const validateOptional = (value: string, min: number, max: number): string | undefined => {
      const len = value.trim().length;
      if (len === 0) return undefined;
      if (len < min) return `At least ${min} characters (${len}/${min})`;
      if (len > max) return `At most ${max} characters (${len}/${max})`;
    };

    const hazardErr = validateOptional(fields.chokingHazardWarning, HAZARD_MIN, HAZARD_MAX);
    if (hazardErr) errs['chokingHazardWarning'] = hazardErr;
    const notesErr = validateOptional(fields.submitterNotes, NOTES_MIN, NOTES_MAX);
    if (notesErr) errs['submitterNotes'] = notesErr;

    const result = FoodItemSchema.safeParse(buildEntry(fields));
    if (!result.success) {
      result.error.errors.forEach((e) => {
        const key = e.path.join('.');
        if (!errs[key]) errs[key] = e.message;
      });
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      entry: buildEntry(fields),
      ...(fields.submitterNotes.trim() ? { submitterNotes: fields.submitterNotes.trim() } : {}),
    };
    await submit(payload);
  };

  if (submission.status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🙌</div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Thank you so much!</h2>
        <p className="text-slate-500 text-sm mb-2">
          Your suggestion has been received and I'll review it personally.
        </p>
        <p className="text-slate-400 text-sm">
          If it's a good fit, it'll show up in the tracker soon. Every contribution helps families feed their babies better!
        </p>
        <div className="mt-8">
          <button
            onClick={() => { reset(); setFields(EMPTY); setSlugTouched(false); setView('suggest'); }}
            className="text-sm text-slate-400 hover:text-slate-600 underline"
          >
            Submit another food
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2.5 mb-6 text-sm">
        <button
          type="button"
          onClick={() => setView('suggest')}
          className={`transition-colors ${view === 'suggest' ? 'font-semibold text-slate-700' : 'text-slate-400 hover:text-slate-500'}`}
        >
          Suggest a food
        </button>
        <span className="text-slate-300 select-none">/</span>
        <button
          type="button"
          onClick={() => setView('browse')}
          className={`transition-colors ${view === 'browse' ? 'font-semibold text-slate-700' : 'text-slate-400 hover:text-slate-500'}`}
        >
          Browse foods
        </button>
      </div>

      {view === 'browse' ? <FoodCatalog /> : (
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-1">Suggest a new food</h2>
          <p className="text-slate-500 text-sm">
            Fill in the form below. I'll review your suggestion personally before it goes live.
          </p>
        </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Name */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Food name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={fields.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Mango"
            className={inputClass}
          />
          {duplicateFood
            ? <p className="text-xs text-amber-600 mt-1">"{duplicateFood.name}" is already in the dataset.</p>
            : <FieldError msg={errors.name} />
          }
        </div>

        {/* ID slug */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            ID{' '}
            <span className="font-normal text-xs text-slate-400">auto-filled · editable</span>
          </label>
          <input
            type="text"
            value={fields.id}
            onChange={(e) => { setSlugTouched(true); set('id', e.target.value); }}
            placeholder="e.g. mango"
            className={`${inputClass} font-mono`}
          />
          <FieldError msg={errors.id} />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Category <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-6">
          {(['Standard', 'Allergen'] as const).map((cat) => (
            <label key={cat} className="relative group flex items-center gap-2 cursor-pointer text-sm text-slate-700">
               <Tooltip text={cat === 'Standard'? 'A food that is generally safe for most babies to eat.' : 'A food that may cause allergic reactions in some babies.'} width="w-36" side="right" />
              <input
                type="radio"
                name="category"
                value={cat}
                checked={fields.category === cat}
                onChange={() => set('category', cat)}
                className="accent-emerald-500"
              />
              {cat}
            </label>
           
          ))}
        </div>
        <FieldError msg={errors.category} />
      </div>

      {/* Dietary type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          What is this food? <span className="text-red-400">*</span>
        </label>
        <select
          value={fields.dietaryType}
          onChange={(e) => set('dietaryType', e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>Select one…</option>
          <option value="vegan">Plant-based — fruit, vegetable, grain, legume</option>
          <option value="vegetarian">Animal product, not meat — egg, dairy</option>
          <option value="standard">Meat or fish — chicken, beef, salmon…</option>
        </select>
        <FieldError msg={errors.dietaryType} />
      </div>

      {/* Preparation 6-9 */}
      <div>
        <div className="flex justify-between items-baseline mb-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Preparation — 6 to 9 months <span className="text-red-400">*</span>
          </label>
          <span className={`text-xs ${fields.prep6_9.trim().length > PREP_MAX ? 'text-red-400' : 'text-slate-400'}`}>
            {fields.prep6_9.trim().length}/{PREP_MAX}
          </span>
        </div>
        <textarea
          value={fields.prep6_9}
          onChange={(e) => set('prep6_9', e.target.value)}
          rows={3}
          maxLength={PREP_MAX + 20}
          placeholder="How to safely prepare this food for a 6–9 month old..."
          className={`${inputClass} resize-none`}
        />
        <FieldError msg={errors['prep6_9'] ?? errors['preparationByAge']} />
      </div>

      {/* Preparation 9-12 */}
      <div>
        <div className="flex justify-between items-baseline mb-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Preparation — 9 to 12 months{' '}
            <span className="text-xs font-normal text-slate-400">(optional)</span>
          </label>
          <span className={`text-xs ${fields.prep9_12.trim().length > PREP_MAX ? 'text-red-400' : 'text-slate-400'}`}>
            {fields.prep9_12.trim().length > 0 ? `${fields.prep9_12.trim().length}/${PREP_MAX}` : ''}
          </span>
        </div>
        <textarea
          value={fields.prep9_12}
          onChange={(e) => set('prep9_12', e.target.value)}
          rows={3}
          maxLength={PREP_MAX + 20}
          placeholder="How to safely prepare this food for a 9–12 month old..."
          className={`${inputClass} resize-none`}
        />
        <FieldError msg={errors['prep9_12']} />
      </div>

      {/* Choking hazard warning */}
      <div>
        <div className="flex justify-between items-baseline mb-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Choking hazard warning{' '}
            <span className="text-xs font-normal text-slate-400">(optional)</span>
          </label>
          <span className={`text-xs ${fields.chokingHazardWarning.trim().length > HAZARD_MAX ? 'text-red-400' : 'text-slate-400'}`}>
            {fields.chokingHazardWarning.trim().length > 0 ? `${fields.chokingHazardWarning.trim().length}/${HAZARD_MAX}` : ''}
          </span>
        </div>
        <textarea
          value={fields.chokingHazardWarning}
          onChange={(e) => set('chokingHazardWarning', e.target.value)}
          rows={2}
          maxLength={HAZARD_MAX + 20}
          placeholder="Describe any specific choking risks..."
          className={`${inputClass} resize-none`}
        />
        <FieldError msg={errors['chokingHazardWarning']} />
      </div>

      {/* Reviewer notes */}
      <div>
        <div className="flex justify-between items-baseline mb-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Notes for the reviewer{' '}
            <span className="text-xs font-normal text-slate-400">(optional — sources, context)</span>
          </label>
          <span className={`text-xs ${fields.submitterNotes.trim().length > NOTES_MAX ? 'text-red-400' : 'text-slate-400'}`}>
            {fields.submitterNotes.trim().length > 0 ? `${fields.submitterNotes.trim().length}/${NOTES_MAX}` : ''}
          </span>
        </div>
        <textarea
          value={fields.submitterNotes}
          onChange={(e) => set('submitterNotes', e.target.value)}
          rows={2}
          maxLength={NOTES_MAX + 20}
          placeholder="e.g. Based on WHO infant feeding guidelines..."
          className={`${inputClass} resize-none`}
        />
        <FieldError msg={errors['submitterNotes']} />
      </div>

      {submission.status === 'error' && (
        <p className={`text-sm rounded-lg px-4 py-3 border ${
          submission.kind === 'rateLimit'
            ? 'text-amber-700 bg-amber-50 border-amber-200'
            : 'text-red-700 bg-red-50 border-red-200'
        }`}>
          {submission.message}
        </p>
      )}

      <div className="flex items-center justify-end pt-1">
        <button
          type="submit"
          disabled={submission.status === 'loading' || !!duplicateFood}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 px-7 rounded-lg transition-colors text-sm"
        >
          {submission.status === 'loading' ? 'Submitting…' : 'Submit contribution'}
        </button>
      </div>
      </form>
      )}
    </>
  );
}
