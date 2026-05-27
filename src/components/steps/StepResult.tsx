import { useRef, useMemo } from 'react';
import type { FormData } from '../../App';
import { getSafeFoodsTool } from '../../domain/getSafeFoods';
import { generate30DayPlan } from '../../domain/blwEngine';
import { compileHtmlTemplate } from '../../domain/pdfGenerator';
import type { FoodItem } from '../../schemas/foodDatasetSchema';

interface StepResultProps {
  formData: FormData;
  onReset: () => void;
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

export function StepResult({ formData, onReset }: StepResultProps) {
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
    const result = getSafeFoodsTool({ profile });
    if (result.safetyStatus === 'BLOCKED_NOT_READY') {
      return { result, checklistHtml: null };
    }
    const plan = generate30DayPlan(result.foods as FoodItem[], formData.startDate, formData.ageMonths!);
    return { result, checklistHtml: compileHtmlTemplate(formData.name, formData.startDate, plan) };
  }, [formData]);

  if (result.safetyStatus === 'BLOCKED_NOT_READY') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Not quite ready yet</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <p className="text-sm text-amber-900 whitespace-pre-line leading-relaxed">{result.note}</p>
        </div>
        <button
          onClick={onReset}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 rounded-lg transition-colors"
        >
          Start over
        </button>
      </div>
    );
  }

  const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white shadow-sm shrink-0">
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
        >
          ← Back
        </button>
        <div className="flex-1 text-center">
          <span className="text-sm font-semibold text-slate-700">{formData.name}'s 30-Day Plan</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => iframeRef.current?.contentWindow?.print()}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Print
          </button>
          <button
            onClick={() => downloadHtml(checklistHtml!, `${slug}-blw-checklist.html`)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Download
          </button>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        srcDoc={checklistHtml!}
        className="flex-1 w-full border-0"
        title={`${formData.name}'s BLW Checklist`}
      />
    </div>
  );
}
