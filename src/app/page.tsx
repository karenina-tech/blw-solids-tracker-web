'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from '@/components/ProgressBar';
import { StepBabyInfo } from '@/components/steps/StepBabyInfo';
import { StepFeedingType } from '@/components/steps/StepFeedingType';
import { StepMilestones } from '@/components/steps/StepMilestones';
import { StepAllergies } from '@/components/steps/StepAllergies';
import { StepDietType } from '@/components/steps/StepDietType';
import { StepResult } from '@/components/steps/StepResult';
import { GreetingCard } from '@/components/GreetingCard';
import { ContributeForm } from '@/components/ContributeForm';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { BrandFooter } from '@/components/BrandFooter';
import { BlogSection } from '@/components/blog/BlogSection';
import { GradientGroup } from '@/components/GradientGroup';
import { PrivacyNote } from '@/components/PrivacyNote';
import { BookOpen, Broccoli, CirclePlus, Coffee, ListChecks } from 'lucide-react';

export type FormData = {
	name: string;
	startDate: string;
	ageMonths: number | null;
	feedingType: 'formula' | 'exclusive_breastfeeding' | undefined;
	milestones: {
		headControl: boolean;
		canSitWithMinimalSupport: boolean;
		reachAndGrab: boolean;
		showsInterestInFood: boolean;
	};
	knownAllergies: boolean | null;
	allergicFoods: string[];
	dietType: 'standard' | 'vegetarian' | 'vegan' | null;
};

type StepId = 'baby-info' | 'feeding-type' | 'milestones' | 'allergies' | 'diet-type' | 'result';

function getSteps(ageMonths: number | null): StepId[] {
	const steps: StepId[] = ['baby-info'];
	if (ageMonths === 5) steps.push('feeding-type');
	steps.push('milestones', 'allergies', 'diet-type', 'result');
	return steps;
}

const initialFormData: FormData = {
	name: '',
	startDate: new Date().toISOString().split('T')[0],
	ageMonths: null,
	feedingType: undefined,
	milestones: {
		headControl: false,
		canSitWithMinimalSupport: false,
		reachAndGrab: false,
		showsInterestInFood: false
	},
	knownAllergies: null,
	allergicFoods: [],
	dietType: null
};

const footerLinkClass =
	'py-1 font-medium hover:text-slate-900 transition-colors';

export default function Page() {
	const { t } = useTranslation();
	const [showGreeting, setShowGreeting] = useState(true);
	const [showContribute, setShowContribute] = useState(false);
	const [formData, setFormData] = useState<FormData>(initialFormData);
	const [stepIndex, setStepIndex] = useState(0);

	// The blog header links to "/?tab=contribute".
	useEffect(() => {
		if (new URLSearchParams(window.location.search).get('tab') === 'contribute') {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setShowGreeting(false);
			setShowContribute(true);
		}
	}, []);

	const steps = useMemo(() => getSteps(formData.ageMonths), [formData.ageMonths]);
	const currentStep = steps[stepIndex];
	const totalSteps = steps.length;

	const goNext = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
	const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));
	const reset = () => {
		setFormData(initialFormData);
		setStepIndex(0);
	};

	const setAge = (ageMonths: number) => {
		setFormData((prev) => ({
			...prev,
			ageMonths,
			feedingType: ageMonths !== 5 ? undefined : prev.feedingType
		}));
	};

	const toggleAllergen = (foodId: string) => {
		setFormData((prev) => ({
			...prev,
			allergicFoods: prev.allergicFoods.includes(foodId)
				? prev.allergicFoods.filter((id) => id !== foodId)
				: [...prev.allergicFoods, foodId]
		}));
	};

	const isResultStep = currentStep === 'result';

	// The logo links to "/". If we are already there the page does not remount, so go back to the welcome screen by hand.
	const goHome = () => {
		reset();
		setShowContribute(false);
		setShowGreeting(true);
	};

	return (
		<div className='flex flex-col flex-1 items-center p-4 pt-10 sm:pt-14'>
			<GradientGroup className='w-full max-w-lg lg:max-w-5xl'>
				<header className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
					<div className='flex items-center gap-3'>
						<Link
							href='/'
							aria-label={t('app.title')}
							onClick={goHome}
							className='inline-flex items-center justify-center w-12 h-12 rounded-md bg-accent-100 shrink-0 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-700'>
							<Broccoli className='w-7 h-7 text-background' aria-hidden />
						</Link>
						<div>
							<h1 className='font-display text-2xl sm:text-3xl font-extrabold leading-none text-accent-700'>
								{t('app.title')}
							</h1>
							<p className='mt-1.5 text-base font-medium text-slate-600'>
								{t('app.badges.free')} <span aria-hidden='true'>/</span> {t('app.badges.noAccount')}
							</p>
						</div>
					</div>
					{/* On phones the language buttons sit on their own row above the title so the title stays on one line. */}
					<div className='order-first self-end sm:order-none sm:self-start'>
						<LanguageSwitcher />
					</div>
				</header>

				<div
					className={`flex flex-col gap-4 ${
						showGreeting ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-stretch lg:gap-6' : ''
					}`}>
				{!showGreeting && (
					<nav className='flex gap-6 border-b-2 border-accent-700/15 lg:col-span-2' aria-label='Sections'>
						{[
							{ active: !showContribute, onClick: () => setShowContribute(false), label: t('app.nav.tracker'), icon: ListChecks },
							{ active: showContribute, onClick: () => setShowContribute(true), label: t('app.nav.contribute'), icon: CirclePlus }
						].map(({ active, onClick, label, icon: Icon }) => (
							<button
								key={label}
								onClick={onClick}
								aria-current={active ? 'page' : undefined}
								className={`inline-flex items-center gap-1.5 -mb-0.5 border-b-4 pb-2 font-display text-base font-bold transition-colors ${
									active
										? 'border-seed-600 text-accent-700'
										: 'border-transparent text-slate-500 hover:text-slate-800'
								}`}>
								{Icon && <Icon className='w-4 h-4' aria-hidden />}
								{label}
							</button>
						))}
						<Link
							href='/blog'
							className='inline-flex items-center gap-1.5 -mb-0.5 border-b-4 border-transparent pb-2 font-display text-base font-bold text-slate-500 transition-colors hover:text-slate-800'>
							<BookOpen className='w-4 h-4' aria-hidden />
							{t('blog.title')}
						</Link>
					</nav>
				)}

					{showGreeting ? (
						<GreetingCard onStart={() => setShowGreeting(false)} />
					) : showContribute ? (
						<div data-sheet className='sheet-gradient rounded-2xl p-5 sm:p-8'>
							<ContributeForm />
						</div>
					) : (
						<div data-sheet className='sheet-gradient rounded-2xl p-5 sm:p-8'>
							{!isResultStep && <ProgressBar current={stepIndex + 1} total={totalSteps - 1} />}


							{currentStep === 'baby-info' && (
								<StepBabyInfo
									name={formData.name}
									startDate={formData.startDate}
									ageMonths={formData.ageMonths}
									onChange={(field, value) => setFormData((prev) => ({ ...prev, [field]: value }))}
									onChangeAge={setAge}
									onNext={goNext}
								/>
							)}

							{currentStep === 'feeding-type' && (
								<StepFeedingType
									feedingType={formData.feedingType}
									onChange={(value) => setFormData((prev) => ({ ...prev, feedingType: value }))}
									onNext={goNext}
									onBack={goBack}
								/>
							)}

							{currentStep === 'milestones' && (
								<StepMilestones
									milestones={formData.milestones}
									onChange={(field, value) =>
										setFormData((prev) => ({
											...prev,
											milestones: { ...prev.milestones, [field]: value }
										}))
									}
									onNext={goNext}
									onBack={goBack}
								/>
							)}

							{currentStep === 'allergies' && (
								<StepAllergies
									knownAllergies={formData.knownAllergies}
									allergicFoods={formData.allergicFoods}
									onChangeKnownAllergies={(value) =>
										setFormData((prev) => ({
											...prev,
											knownAllergies: value,
											allergicFoods: value ? prev.allergicFoods : []
										}))
									}
									onToggleAllergen={toggleAllergen}
									onNext={goNext}
									onBack={goBack}
								/>
							)}

							{currentStep === 'diet-type' && (
								<StepDietType
									dietType={formData.dietType}
									onChange={(value) => setFormData((prev) => ({ ...prev, dietType: value }))}
									onNext={goNext}
									onBack={goBack}
								/>
							)}

							{currentStep === 'result' && <StepResult formData={formData} onReset={reset} onBack={goBack} />}
						</div>
					)}
					{showGreeting && <BlogSection />}
				</div>

				<div
					className={`mt-6 flex flex-col items-center gap-2 ${
						showGreeting ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-6' : ''
					}`}>
					<p className='flex flex-wrap justify-center items-center gap-x-2.5 gap-y-1 text-base text-slate-600'>
						<span>{t('app.footer.openSource')}</span>
						<span aria-hidden='true'>·</span>
						<a
							href='https://github.com/karenina-tech/blw-solids-tracker-web'
							className={footerLinkClass}
							target='_blank'
							rel='noopener noreferrer'>
							GitHub
						</a>
						<span aria-hidden='true'>·</span>
						<a
							href='https://buymeacoffee.com/karenina.tech'
							target='_blank'
							rel='noopener noreferrer'
							className={`${footerLinkClass} inline-flex items-center gap-1`}>
							<Coffee className='w-5 h-5' aria-hidden />
							Buy me a coffee
						</a>
						<span aria-hidden='true'>·</span>
						<PrivacyNote />
					</p>
					<div className='text-center'>
						<BrandFooter />
					</div>
				</div>
			</GradientGroup>
		</div>
	);
}
