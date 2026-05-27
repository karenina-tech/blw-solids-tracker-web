import { useState, useMemo } from 'react';
import { ProgressBar } from './components/ProgressBar';
import { StepBabyInfo } from './components/steps/StepBabyInfo';
import { StepAge } from './components/steps/StepAge';
import { StepFeedingType } from './components/steps/StepFeedingType';
import { StepMilestones } from './components/steps/StepMilestones';
import { StepAllergies } from './components/steps/StepAllergies';
import { StepDietType } from './components/steps/StepDietType';
import { StepResult } from './components/steps/StepResult';

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
    showsInterestInFood: false,
  },
  knownAllergies: null,
  allergicFoods: [],
  dietType: null,
};

export default function App() {
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
      feedingType: ageMonths !== 5 ? undefined : prev.feedingType,
    }));
  };

  const toggleAllergen = (foodId: string) => {
    setFormData((prev) => ({
      ...prev,
      allergicFoods: prev.allergicFoods.includes(foodId)
        ? prev.allergicFoods.filter((id) => id !== foodId)
        : [...prev.allergicFoods, foodId],
    }));
  };

  const isResultStep = currentStep === 'result';

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <span className="text-3xl">🥑</span>
          <h1 className="text-lg font-bold text-slate-700 mt-1">BLW Solids Tracker</h1>
          <p className="text-xs text-slate-400">Free · No account needed · No AI required</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          {!isResultStep && (
            <ProgressBar current={stepIndex + 1} total={totalSteps - 1} />
          )}

          {currentStep === 'baby-info' && (
            <StepBabyInfo
              name={formData.name}
              startDate={formData.startDate}
              onChange={(field, value) => setFormData((prev) => ({ ...prev, [field]: value }))}
              onNext={goNext}
            />
          )}

          {currentStep === 'age' && (
            <StepAge
              ageMonths={formData.ageMonths}
              onChange={setAge}
              onNext={goNext}
              onBack={goBack}
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
                  milestones: { ...prev.milestones, [field]: value },
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
                  allergicFoods: value ? prev.allergicFoods : [],
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

          {currentStep === 'result' && (
            <StepResult formData={formData} onReset={reset} />
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Open source ·{' '}
          <a
            href="https://github.com/KareninaTech/blw-solids-tracker-skill"
            className="underline hover:text-slate-600"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </p>
      </div>
    </div>
  );
}
