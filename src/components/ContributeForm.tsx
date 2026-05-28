import { useState } from 'react';
import { FoodItemSchema } from '../schemas/foodDatasetSchema';
import type { SubmissionState } from '../types/contribution';

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

const inputClass =
  'w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500';

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

export function ContributeForm({ workerUrl }: ContributeFormProps) {
  const [fields, setFields] = useState<FormFields>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submission, setSubmission] = useState<SubmissionState>({ status: 'idle' });

  const set = (key: keyof FormFields, value: string) =>
    setFields((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'name' && !slugTouched) next.id = toSlug(value);
      return next;
    });

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fields.dietaryType) errs.dietaryType = 'Please select a dietary type';
    const result = FoodItemSchema.safeParse(buildEntry(fields));
    if (!result.success) {
      result.error.errors.forEach((e) => { errs[e.path.join('.')] = e.message; });
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmission({ status: 'loading' });
    try {
      const payload = {
        entry: buildEntry(fields),
        ...(fields.submitterNotes.trim() ? { submitterNotes: fields.submitterNotes.trim() } : {}),
      };
      const res = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ message: 'Unknown error' })) as { message?: string };
        setSubmission({ status: 'error', message: body.message ?? `Request failed (${res.status})` });
        return;
      }
      const data = await res.json() as { issueUrl: string };
      setSubmission({ status: 'success', issueUrl: data.issueUrl });
    } catch {
      setSubmission({ status: 'error', message: 'Network error. Please check your connection and try again.' });
    }
  };

  if (submission.status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Submission received!</h2>
        <p className="text-slate-500 text-sm mb-6">
          Your contribution has been sent for review. A maintainer will look it over shortly.
        </p>
        <a
          href={submission.issueUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 underline"
        >
          View your submission on GitHub →
        </a>
        <div className="mt-8">
          <button
            onClick={() => { setSubmission({ status: 'idle' }); setFields(EMPTY); setSlugTouched(false); }}
            className="text-sm text-slate-400 hover:text-slate-600 underline"
          >
            Submit another food
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
          <FieldError msg={errors.name} />
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
            <label key={cat} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
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
          Dietary type <span className="text-red-400">*</span>
        </label>
        <select
          value={fields.dietaryType}
          onChange={(e) => set('dietaryType', e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>Select one…</option>
          <option value="standard">Standard (includes meat)</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>
        <FieldError msg={errors.dietaryType} />
      </div>

      {/* Preparation 6-9 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Preparation — 6 to 9 months <span className="text-red-400">*</span>
        </label>
        <textarea
          value={fields.prep6_9}
          onChange={(e) => set('prep6_9', e.target.value)}
          rows={3}
          placeholder="How to safely prepare this food for a 6–9 month old..."
          className={`${inputClass} resize-none`}
        />
        <FieldError msg={errors['preparationByAge']} />
      </div>

      {/* Preparation 9-12 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Preparation — 9 to 12 months <span className="text-red-400">*</span>
        </label>
        <textarea
          value={fields.prep9_12}
          onChange={(e) => set('prep9_12', e.target.value)}
          rows={3}
          placeholder="How to safely prepare this food for a 9–12 month old..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Choking hazard warning */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Choking hazard warning{' '}
          <span className="text-xs font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          value={fields.chokingHazardWarning}
          onChange={(e) => set('chokingHazardWarning', e.target.value)}
          rows={2}
          placeholder="Describe any specific choking risks..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Reviewer notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Notes for the reviewer{' '}
          <span className="text-xs font-normal text-slate-400">(optional — sources, context)</span>
        </label>
        <textarea
          value={fields.submitterNotes}
          onChange={(e) => set('submitterNotes', e.target.value)}
          rows={2}
          placeholder="e.g. Based on WHO infant feeding guidelines..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {submission.status === 'error' && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {submission.message}
        </p>
      )}

      <div className="flex items-center justify-end pt-1">
        <button
          type="submit"
          disabled={submission.status === 'loading'}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 px-7 rounded-lg transition-colors text-sm"
        >
          {submission.status === 'loading' ? 'Submitting…' : 'Submit contribution'}
        </button>
      </div>
    </form>
  );
}
