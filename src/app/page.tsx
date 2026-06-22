'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from '@/components/ProgressBar';
import { StepBabyInfo } from '@/components/steps/StepBabyInfo';
import { StepAge } from '@/components/steps/StepAge';
import { StepFeedingType } from '@/components/steps/StepFeedingType';
import { StepMilestones } from '@/components/steps/StepMilestones';
import { StepAllergies } from '@/components/steps/StepAllergies';
import { StepDietType } from '@/components/steps/StepDietType';
import { StepResult } from '@/components/steps/StepResult';
import { GreetingCard } from '@/components/GreetingCard';
import { ContributeForm } from '@/components/ContributeForm';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Broccoli } from 'lucide-react';

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

type StepId = 'baby-info' | 'age' | 'feeding-type' | 'milestones' | 'allergies' | 'diet-type' | 'result';

function getSteps(ageMonths: number | null): StepId[] {
	const steps: StepId[] = ['baby-info', 'age'];
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

export default function Page() {
	const { t } = useTranslation();
	const [showGreeting, setShowGreeting] = useState(true);
	const [showContribute, setShowContribute] = useState(false);
	const [formData, setFormData] = useState<FormData>(initialFormData);
	const [stepIndex, setStepIndex] = useState(0);

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

	return (
		<div className='flex flex-col flex-1 items-center p-4 pt-10 sm:pt-14'>
			<div className='w-full max-w-lg'>
				<div className='text-center mb-4'>
					<div className='flex justify-end mb-2'>
						<LanguageSwitcher />
					</div>
					<span className='inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent-100'>
						<Broccoli className='w-6 h-6 text-background' aria-hidden />
					</span>

					<h1 className='text-lg font-bold text-slate-700 mt-1'>{t('app.title')}</h1>
					<div className='flex justify-center gap-2 mt-2 flex-wrap'>
						{(['free', 'noAccount'] as const).map((key) => (
							<span
								key={key}
								className='bg-accent-50 text-accent-600 text-xs font-medium px-3 py-1 rounded-full'>
								{t(`app.badges.${key}`)}
							</span>
						))}
					</div>
				</div>

				{!showGreeting && (
					<div className='flex justify-center gap-2 mb-4 flex-wrap'>
						<div className='inline-flex bg-white/60 backdrop-blur-sm rounded-full p-1 gap-1 shadow-sm'>
							<button
								onClick={() => setShowContribute(false)}
								className={`px-5 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
									!showContribute
										? 'bg-seed-600 text-white shadow-sm'
										: 'text-slate-400 hover:text-slate-600'
								}`}>
								{t('app.nav.tracker')}
							</button>
							<button
								onClick={() => setShowContribute(true)}
								className={`px-5 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
									showContribute
										? 'bg-seed-600 text-white shadow-sm'
										: 'text-slate-400 hover:text-slate-600'
								}`}>
								{t('app.nav.contribute')}
							</button>
						</div>
					</div>
				)}

				{showGreeting ? (
					<GreetingCard onStart={() => setShowGreeting(false)} />
				) : showContribute ? (
					<div className='bg-white rounded-2xl shadow-md p-8'>
						<ContributeForm />
					</div>
				) : (
					<div className='bg-white rounded-2xl shadow-md p-8'>
						{!isResultStep && <ProgressBar current={stepIndex + 1} total={totalSteps - 1} />}

						{currentStep === 'baby-info' && (
							<StepBabyInfo
								name={formData.name}
								startDate={formData.startDate}
								onChange={(field, value) => setFormData((prev) => ({ ...prev, [field]: value }))}
								onNext={goNext}
							/>
						)}

						{currentStep === 'age' && (
							<StepAge ageMonths={formData.ageMonths} onChange={setAge} onNext={goNext} onBack={goBack} />
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

				<p className='flex justify-center items-center gap-2 text-xs text-slate-400 mt-4'>
					{t('app.footer.openSource')} ·{' '}
					<a
						href='https://github.com/karenina-tech/blw-solids-tracker-web'
						className='underline hover:text-slate-600'
						target='_blank'
						rel='noopener noreferrer'>
						GitHub
					</a>
					<span className='text-lg'>·</span>
					<a
						href='https://buymeacoffee.com/karenina.tech'
						target='_blank'
						rel='noopener noreferrer'
						className='hover:text-slate-600'>
						☕ Buy me a coffee
					</a>
				</p>
			</div>
		</div>
	);
}
