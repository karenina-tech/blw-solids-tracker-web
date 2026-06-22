'use client';

import { useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { FormData } from '@/app/page';
import { getSafeFoodsTool } from '@/domain/getSafeFoods';
import { defaultFoodRepository } from '@/domain/services/foodRepository';
import { defaultProfileValidator } from '@/domain/services/profileValidator';
import { defaultPlanGenerator } from '@/domain/services/planGenerator';
import { compileHtmlTemplate } from '@/domain/pdfGenerator';
import type { MissingMilestone } from '@/domain/getSafeFoods';

interface StepResultProps {
  formData: FormData;
  onReset: () => void;
  onBack: () => void;
}

function downloadHtml(html: string, filename: string) {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const MILESTONE_KEY: Record<MissingMilestone, string> = {
  headControl: 'steps.result.notReady.missing_headControl',
  canSitWithMinimalSupport: 'steps.result.notReady.missing_canSitWithMinimalSupport',
  reachAndGrab: 'steps.result.notReady.missing_reachAndGrab',
};

export function StepResult({ formData, onReset, onBack }: StepResultProps) {
  const { t } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { result, checklistHtml } = useMemo(() => {
    const profile = {
      name: formData.name,
      ageMonths: formData.ageMonths!,
      startDate: formData.startDate,
      dietType: formData.dietType!,
      knownAllergies: formData.knownAllergies ?? false,
      allergicFoods: formData.allergicFoods,
      feedingType: formData.feedingType,
      developmentalMilestones: formData.milestones,
    };
    const result = getSafeFoodsTool(defaultFoodRepository, defaultProfileValidator, { profile });
    if (!result.success) {
      return { result, checklistHtml: null };
    }
    const plan = defaultPlanGenerator.generate(result.foods, formData.startDate, formData.ageMonths!);
    return { result, checklistHtml: compileHtmlTemplate(formData.name, formData.startDate, plan) };
  }, [formData]);

  if (!result.success) {
    const name = result.babyName;
    let noteContent: React.ReactNode;

    if (result.reason === 'exclusive_breastfeeding') {
      noteContent = <p className="text-sm text-amber-900 whitespace-pre-line leading-relaxed">{t('steps.result.notReady.exclusive_breastfeeding')}</p>;
    } else if (result.reason === 'age_too_young') {
      noteContent = <p className="text-sm text-amber-900 whitespace-pre-line leading-relaxed">{t('steps.result.notReady.age_too_young')}</p>;
    } else {
      const missingList = (result.missingMilestones ?? [])
        .map((m) => `• ${name} ${t(MILESTONE_KEY[m])}`)
        .join('\n');
      noteContent = (
        <div className="text-sm text-amber-900 leading-relaxed space-y-3">
          <p className="whitespace-pre-line">{t('steps.result.notReady.milestones_intro', { name })}</p>
          <p className="whitespace-pre-line pl-2">{missingList}</p>
          <p className="whitespace-pre-line">{t('steps.result.notReady.milestones_outro', { name })}</p>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('steps.result.notReady.title')}</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          {noteContent}
        </div>
        <button
          onClick={onReset}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 rounded-lg transition-colors"
        >
          {t('common.startOver')}
        </button>
      </div>
    );
  }

  const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white shadow-sm shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
        >
          {t('common.back')}
        </button>
        <div className="flex-1 text-center">
          <span className="text-sm font-semibold text-slate-700">
            {t('steps.result.planTitle', { name: formData.name })}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => downloadHtml(checklistHtml!, `${slug}-blw-checklist.html`)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            title="Download as HTML file"
          >
            {t('steps.result.html')}
          </button>
          <button
            onClick={() => iframeRef.current?.contentWindow?.print()}
            className="bg-seed-600 hover:bg-seed-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            title="Opens print dialog — choose 'Save as PDF'"
          >
            {t('steps.result.pdf')}
          </button>
        </div>
      </div>
      {result.showFoodInterestNote && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 text-xs text-amber-800">
          {t('steps.result.foodInterestNote')}
        </div>
      )}
      <iframe
        ref={iframeRef}
        srcDoc={checklistHtml!}
        className="flex-1 w-full border-0"
        title={`${formData.name}'s BLW Checklist`}
      />
    </div>
  );
}
