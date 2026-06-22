'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FoodItemSchema } from '@/types/food';
import { FOOD_DATASET } from '@/data/foodDataset';
import { useSubmission } from '@/hooks/useSubmission';
import { FoodCatalog } from '@/components/FoodCatalog';
import { Tooltip } from '@/components/Tooltip';

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
	submitterNotes: ''
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
		...(f.chokingHazardWarning.trim() ? { chokingHazardWarning: f.chokingHazardWarning.trim() } : {})
	};
}

const DIETARY_OPTIONS = [
	{ value: 'vegan', emoji: '🌱' },
	{ value: 'vegetarian', emoji: '🥚' },
	{ value: 'standard', emoji: '🥩' }
] as const;

const PREP_MIN = 20;
const PREP_MAX = 150;
const HAZARD_MIN = 30;
const HAZARD_MAX = 150;
const NOTES_MIN = 20;
const NOTES_MAX = 500;

const inputClass =
	'w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500';

function FieldError({ msg }: { msg?: string }) {
	if (!msg) return null;
	return <p className='text-xs text-red-500 mt-1'>{msg}</p>;
}

export function ContributeForm() {
	const { t } = useTranslation();
	const [view, setView] = useState<'suggest' | 'browse'>('suggest');
	const [fields, setFields] = useState<FormFields>(EMPTY);
	const [slugTouched, setSlugTouched] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const { submission, submit, reset } = useSubmission('/api/contribute');
	const [dietOpen, setDietOpen] = useState(false);
	const dietRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (dietRef.current && !dietRef.current.contains(e.target as Node)) {
				setDietOpen(false);
			}
		}
		if (dietOpen) document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [dietOpen]);

	const set = (key: keyof FormFields, value: string) =>
		setFields((prev) => {
			const next = { ...prev, [key]: value };
			if (key === 'name' && !slugTouched) next.id = toSlug(value);
			return next;
		});

	const duplicateFood =
		fields.name.trim().length > 0
			? FOOD_DATASET.find(
					(f) =>
						f.name.toLowerCase() === fields.name.trim().toLowerCase() ||
						f.id.toLowerCase() === fields.id.trim().toLowerCase()
				)
			: undefined;

	const validatePrepField = (value: string): string | undefined => {
		const len = value.trim().length;
		if (len === 0) return undefined;
		if (len < PREP_MIN) return t('contribute.form.minChars', { min: PREP_MIN, len });
		if (len > PREP_MAX) return t('contribute.form.maxChars', { max: PREP_MAX, len });
	};

	const validate = (): boolean => {
		const errs: Record<string, string> = {};
		if (!fields.dietaryType)
			errs.dietaryType = t('contribute.form.required_selection', { field: 'dietary type' });

		if (!fields.prep6_9.trim()) errs['prep6_9'] = t('contribute.form.required_field');
		else {
			const e = validatePrepField(fields.prep6_9);
			if (e) errs['prep6_9'] = e;
		}

		if (!fields.prep9_12.trim()) errs['prep9_12'] = t('contribute.form.required_field');
		else {
			const e = validatePrepField(fields.prep9_12);
			if (e) errs['prep9_12'] = e;
		}

		const validateOptional = (value: string, min: number, max: number): string | undefined => {
			const len = value.trim().length;
			if (len === 0) return undefined;
			if (len < min) return t('contribute.form.minChars', { min, len });
			if (len > max) return t('contribute.form.maxChars', { max, len });
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
			...(fields.submitterNotes.trim() ? { submitterNotes: fields.submitterNotes.trim() } : {})
		};
		await submit(payload);
	};

	if (submission.status === 'success') {
		return (
			<div className='text-center py-8'>
				<div className='text-4xl mb-4'>🙌</div>
				<h2 className='text-xl font-bold text-slate-800 mb-2'>{t('contribute.success.title')}</h2>
				<p className='text-slate-500 text-sm mb-2'>{t('contribute.success.body')}</p>
				<p className='text-slate-400 text-sm'>{t('contribute.success.note')}</p>

				<div className='mt-6'>
					<button
						onClick={() => {
							reset();
							setFields(EMPTY);
							setSlugTouched(false);
							setView('suggest');
						}}
						className='text-sm text-slate-400 hover:text-slate-600 underline'>
						{t('contribute.success.submitAnother')}
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className='flex items-center justify-center gap-2.5 mb-6 text-sm'>
				<button
					type='button'
					onClick={() => setView('suggest')}
					className={`transition-colors ${view === 'suggest' ? 'font-semibold text-slate-700' : 'text-slate-400 hover:text-slate-500'}`}>
					{t('contribute.suggestFood')}
				</button>
				<span className='text-slate-300 select-none'>/</span>
				<button
					type='button'
					onClick={() => setView('browse')}
					className={`transition-colors ${view === 'browse' ? 'font-semibold text-slate-700' : 'text-slate-400 hover:text-slate-500'}`}>
					{t('contribute.browseFoods')}
				</button>
			</div>

			{view === 'browse' ? (
				<FoodCatalog />
			) : (
				<form onSubmit={handleSubmit} noValidate className='space-y-5'>
					<div className='mb-6'>
						<h2 className='text-xl font-bold text-slate-800 mb-1'>{t('contribute.form.title')}</h2>
						<p className='text-slate-500 text-sm'>{t('contribute.form.subtitle')}</p>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div className='col-span-2 sm:col-span-1'>
							<label className='block text-sm font-medium text-slate-700 mb-1.5'>
								{t('contribute.form.nameLabel')}{' '}
								<span className='text-red-400'>{t('contribute.form.required')}</span>
							</label>
							<input
								type='text'
								value={fields.name}
								onChange={(e) => set('name', e.target.value)}
								placeholder='e.g. Mango'
								className={inputClass}
							/>
							{duplicateFood ? (
								<p className='text-xs text-amber-600 mt-1'>
									{t('contribute.form.duplicate', { name: duplicateFood.name })}
								</p>
							) : (
								<FieldError msg={errors.name} />
							)}
						</div>

						<div className='col-span-2 sm:col-span-1'>
							<label className='block text-sm font-medium text-slate-700 mb-1.5'>
								{t('contribute.form.idLabel')}{' '}
								<span className='font-normal text-xs text-slate-400'>{t('contribute.form.idHint')}</span>
							</label>
							<input
								type='text'
								value={fields.id}
								onChange={(e) => {
									setSlugTouched(true);
									set('id', e.target.value);
								}}
								placeholder='e.g. mango'
								className={`${inputClass} font-mono`}
							/>
							<FieldError msg={errors.id} />
						</div>
					</div>

					<div>
						<label className='block text-sm font-medium text-slate-700 mb-2'>
							{t('contribute.form.categoryLabel')}{' '}
							<span className='text-red-400'>{t('contribute.form.required')}</span>
						</label>
						<div className='flex gap-6'>
							{(['Standard', 'Allergen'] as const).map((cat) => (
								<label
									key={cat}
									className='relative group flex items-center gap-2 cursor-pointer text-sm text-slate-700'>
									<Tooltip text={t(`contribute.form.categoryTooltip.${cat}`)} width='w-36' side='right' />
									<input
										type='radio'
										name='category'
										value={cat}
										checked={fields.category === cat}
										onChange={() => set('category', cat)}
										className='accent-seed-600'
									/>
									{t(`contribute.form.categoryOptions.${cat}`)}
								</label>
							))}
						</div>
						<FieldError msg={errors.category} />
					</div>

					<div>
						<label className='block text-sm font-medium text-slate-700 mb-1.5'>
							{t('contribute.form.dietaryTypeLabel')}{' '}
							<span className='text-red-400'>{t('contribute.form.required')}</span>
						</label>
						<div ref={dietRef} className='relative'>
							<button
								type='button'
								onClick={() => setDietOpen((o) => !o)}
								className={[
									'w-full flex items-center justify-between border rounded-lg px-4 py-2.5 text-sm bg-white transition-colors',
									dietOpen
										? 'border-accent-500 ring-1 ring-accent-500'
										: 'border-slate-300 hover:border-slate-400'
								].join(' ')}>
								{fields.dietaryType ? (
									<span className='flex items-center gap-2 text-slate-700'>
										<span>{DIETARY_OPTIONS.find((o) => o.value === fields.dietaryType)?.emoji}</span>
										<span>{t(`contribute.form.dietaryTypeOptions.${fields.dietaryType}`)}</span>
									</span>
								) : (
									<span className='text-slate-400'>
										{t('contribute.form.dietaryTypeOptions.placeholder')}
									</span>
								)}
								<svg
									className={`w-4 h-4 shrink-0 transition-transform ${dietOpen ? 'rotate-180 text-accent-500' : 'text-slate-400'}`}
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
									strokeWidth={2}>
									<path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
								</svg>
							</button>
							{dietOpen && (
								<div className='absolute z-50 top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg py-1 select-none'>
									{DIETARY_OPTIONS.map(({ value, emoji }) => (
										<button
											key={value}
											type='button'
											onClick={() => {
												set('dietaryType', value);
												setDietOpen(false);
											}}
											className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors hover:bg-slate-50 ${
												fields.dietaryType === value ? 'text-accent-600 font-medium' : 'text-slate-700'
											}`}>
											<span className='text-base leading-none'>{emoji}</span>
											<span>{t(`contribute.form.dietaryTypeOptions.${value}`)}</span>
											{fields.dietaryType === value && (
												<span className='ml-auto text-accent-600 text-xs'>✓</span>
											)}
										</button>
									))}
								</div>
							)}
						</div>
						<FieldError msg={errors.dietaryType} />
					</div>

					{(['prep6_9', 'prep9_12'] as const).map((field) => {
						const labelKey =
							field === 'prep6_9' ? 'contribute.form.prep6_9Label' : 'contribute.form.prep9_12Label';
						const placeholderKey =
							field === 'prep6_9'
								? 'contribute.form.prep6_9Placeholder'
								: 'contribute.form.prep9_12Placeholder';
						const len = fields[field].trim().length;
						return (
							<div key={field}>
								<div className='flex justify-between items-baseline mb-1.5'>
									<label className='block text-sm font-medium text-slate-700'>
										{t(labelKey)} <span className='text-red-400'>{t('contribute.form.required')}</span>
									</label>
									<span className={`text-xs ${len > PREP_MAX ? 'text-red-400' : 'text-slate-400'}`}>
										{len > 0 ? `${len}/${PREP_MAX}` : ''}
									</span>
								</div>
								<textarea
									value={fields[field]}
									onChange={(e) => set(field, e.target.value)}
									rows={3}
									maxLength={PREP_MAX + 20}
									placeholder={t(placeholderKey)}
									className={`${inputClass} resize-none`}
								/>
								{!errors[field] && len > 0 && len < PREP_MIN ? (
									<p className='text-xs text-amber-500 mt-1'>
										{t('contribute.form.minProgress', { min: PREP_MIN, remaining: PREP_MIN - len })}
									</p>
								) : (
									<FieldError msg={errors[field]} />
								)}
							</div>
						);
					})}

					<div>
						<div className='flex justify-between items-baseline mb-1.5'>
							<label className='block text-sm font-medium text-slate-700'>
								{t('contribute.form.chokingWarningLabel')}{' '}
								<span className='text-xs font-normal text-slate-400'>
									{t('contribute.form.chokingOptional')}
								</span>
							</label>
							<span
								className={`text-xs ${fields.chokingHazardWarning.trim().length > HAZARD_MAX ? 'text-red-400' : 'text-slate-400'}`}>
								{fields.chokingHazardWarning.trim().length > 0
									? `${fields.chokingHazardWarning.trim().length}/${HAZARD_MAX}`
									: ''}
							</span>
						</div>
						<textarea
							value={fields.chokingHazardWarning}
							onChange={(e) => set('chokingHazardWarning', e.target.value)}
							rows={2}
							maxLength={HAZARD_MAX + 20}
							placeholder={t('contribute.form.chokingWarningPlaceholder')}
							className={`${inputClass} resize-none`}
						/>
						<FieldError msg={errors['chokingHazardWarning']} />
					</div>

					<div>
						<div className='flex justify-between items-baseline mb-1.5'>
							<label className='block text-sm font-medium text-slate-700'>
								{t('contribute.form.notesLabel')}{' '}
								<span className='text-xs font-normal text-slate-400'>{t('contribute.form.notesHint')}</span>
							</label>
							<span
								className={`text-xs ${fields.submitterNotes.trim().length > NOTES_MAX ? 'text-red-400' : 'text-slate-400'}`}>
								{fields.submitterNotes.trim().length > 0
									? `${fields.submitterNotes.trim().length}/${NOTES_MAX}`
									: ''}
							</span>
						</div>
						<textarea
							value={fields.submitterNotes}
							onChange={(e) => set('submitterNotes', e.target.value)}
							rows={2}
							maxLength={NOTES_MAX + 20}
							placeholder={t('contribute.form.notesPlaceholder')}
							className={`${inputClass} resize-none`}
						/>
						<FieldError msg={errors['submitterNotes']} />
					</div>

					{submission.status === 'error' && (
						<p
							className={`text-sm rounded-lg px-4 py-3 border ${
								submission.kind === 'rateLimit'
									? 'text-amber-700 bg-amber-50 border-amber-200'
									: 'text-red-700 bg-red-50 border-red-200'
							}`}>
							{submission.message}
						</p>
					)}

					<div className='flex items-center justify-end pt-1'>
						<button
							type='submit'
							disabled={submission.status === 'loading' || !!duplicateFood}
							className='bg-seed-600 hover:bg-seed-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 px-7 rounded-lg transition-colors text-sm'>
							{submission.status === 'loading'
								? t('contribute.form.submitting')
								: t('contribute.form.submit')}
						</button>
					</div>
				</form>
			)}
		</>
	);
}
