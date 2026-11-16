'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Info, X } from 'lucide-react';
import { track } from '@vercel/analytics';
import {
  PLUS_PLANS,
  PlusInterestSchema,
  type PlusInterestFieldErrors,
  type PlusPlan,
} from '@/types/plusInterest';

type Status = 'idle' | 'sending' | 'sent';
type Field = keyof PlusInterestFieldErrors;

const PLAN_KEY: Record<PlusPlan, string> = {
  monthly: 'plus.planMonthly',
  six_month: 'plus.planSixMonth',
  not_sure: 'plus.planNotSure',
};

const FIELD_ORDER: Field[] = ['email', 'plan', 'wish', 'consent'];
const FIELD_ID: Record<Field, string> = {
  email: 'plus-email',
  plan: 'plus-plan-monthly',
  wish: 'plus-wish',
  consent: 'plus-consent',
};

const input =
  'w-full border border-slate-300 rounded-lg px-4 py-2.5 text-base text-slate-700 placeholder-slate-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500';
const inputError = 'border-red-400 focus:border-red-500 focus:ring-red-500';

function PlusDialog({ onClose }: { onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<PlusPlan | ''>('');
  const [wish, setWish] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<PlusInterestFieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    track('plus_interest_open');
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const errorText = (code?: string) => (code ? t(`plus.errors.${code}`, { defaultValue: t('plus.errors.server') }) : '');

  function focusField(field: Field) {
    formRef.current?.querySelector<HTMLElement>(`#${FIELD_ID[field]}`)?.focus();
  }

  function showFieldErrors(found: PlusInterestFieldErrors) {
    setErrors(found);
    const first = FIELD_ORDER.find((f) => found[f]);
    if (first) focusField(first);
  }

  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    setServerError(null);

    const locale = i18n.language?.startsWith('es') ? 'es' : 'en';
    const website = (new FormData(e.currentTarget).get('website') as string) ?? '';
    const payload = { email, plan: plan || undefined, wish: wish || undefined, consent, locale, website };

    const parsed = PlusInterestSchema.safeParse(payload);
    if (!parsed.success) {
      const found: PlusInterestFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as Field;
        if (FIELD_ORDER.includes(field) && !found[field]) found[field] = issue.message;
      }
      showFieldErrors(found);
      return;
    }
    setErrors({});
    setStatus('sending');

    try {
      const res = await fetch('/api/plus-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        kind?: string;
        errors?: PlusInterestFieldErrors;
      };

      if (res.ok && json.ok) {
        track('plus_interest_sent', { plan: parsed.data.plan });
        setStatus('sent');
        return;
      }
      setStatus('idle');
      if (json.errors) showFieldErrors(json.errors);
      else setServerError(json.kind === 'rateLimit' ? 'rateLimit' : 'server');
    } catch {
      setStatus('idle');
      setServerError('network');
    }
  }

  const sending = status === 'sending';

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 text-left"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 id={titleId} className="text-xl font-bold text-slate-800">
            {status === 'sent' ? t('plus.thanksTitle') : t('plus.dialogTitle')}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t('plus.close')}
            className="text-slate-500 hover:text-slate-800 shrink-0 p-1 -m-1"
          >
            <X className="w-6 h-6" aria-hidden />
          </button>
        </div>

        {status === 'sent' ? (
          <div role="status">
            <p className="text-base text-slate-600 leading-relaxed">{t('plus.thanksBody')}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 bg-seed-600 hover:bg-seed-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
            >
              {t('plus.close')}
            </button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
            <p className="text-base text-slate-600 leading-relaxed">{t('plus.dialogIntro')}</p>

            {/* Honeypot: hidden from people and from screen readers. */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
              <label htmlFor="plus-website">Website</label>
              <input id="plus-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>

            <div>
              <label htmlFor="plus-email" className="block text-base font-medium text-slate-700 mb-1.5">
                {t('plus.emailLabel')}
              </label>
              <input
                id="plus-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((x) => ({ ...x, email: undefined }));
                }}
                placeholder={t('plus.emailPlaceholder')}
                aria-required="true"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'plus-email-error' : undefined}
                className={`${input} ${errors.email ? inputError : ''}`}
              />
              {errors.email && (
                <p id="plus-email-error" className="mt-1.5 text-base font-medium text-red-700">
                  {errorText(errors.email)}
                </p>
              )}
            </div>

            <fieldset aria-describedby={errors.plan ? 'plus-plan-error' : undefined}>
              <legend className="block text-base font-medium text-slate-700 mb-1">{t('plus.planLabel')}</legend>
              {PLUS_PLANS.map((value) => (
                <label key={value} className="flex items-center gap-3 py-2 text-base text-slate-700 cursor-pointer">
                  <input
                    id={value === 'monthly' ? 'plus-plan-monthly' : undefined}
                    type="radio"
                    name="plus-plan"
                    value={value}
                    checked={plan === value}
                    onChange={() => {
                      setPlan(value);
                      if (errors.plan) setErrors((x) => ({ ...x, plan: undefined }));
                    }}
                    className="w-5 h-5 accent-seed-600"
                  />
                  {t(PLAN_KEY[value])}
                </label>
              ))}
              {errors.plan && (
                <p id="plus-plan-error" className="mt-1 text-base font-medium text-red-700">
                  {errorText(errors.plan)}
                </p>
              )}
            </fieldset>

            <div>
              <label htmlFor="plus-wish" className="block text-base font-medium text-slate-700 mb-1.5">
                {t('plus.wishLabel')}
              </label>
              <textarea
                id="plus-wish"
                rows={3}
                value={wish}
                onChange={(e) => {
                  setWish(e.target.value);
                  if (errors.wish) setErrors((x) => ({ ...x, wish: undefined }));
                }}
                placeholder={t('plus.wishPlaceholder')}
                aria-invalid={errors.wish ? true : undefined}
                aria-describedby={errors.wish ? 'plus-wish-error' : undefined}
                className={`${input} resize-none ${errors.wish ? inputError : ''}`}
              />
              {errors.wish && (
                <p id="plus-wish-error" className="mt-1.5 text-base font-medium text-red-700">
                  {errorText(errors.wish)}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-3 text-base text-slate-700 leading-snug cursor-pointer">
                <input
                  id="plus-consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    if (errors.consent) setErrors((x) => ({ ...x, consent: undefined }));
                  }}
                  aria-required="true"
                  aria-invalid={errors.consent ? true : undefined}
                  aria-describedby={errors.consent ? 'plus-consent-error' : undefined}
                  className="w-5 h-5 mt-0.5 shrink-0 accent-seed-600"
                />
                <span>{t('plus.consent')}</span>
              </label>
              {errors.consent && (
                <p id="plus-consent-error" className="mt-1.5 text-base font-medium text-red-700">
                  {errorText(errors.consent)}
                </p>
              )}
            </div>

            {serverError && (
              <p role="alert" className="text-base font-medium text-red-700">
                {t(`plus.errors.${serverError}`)}
              </p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="bg-seed-600 hover:bg-seed-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {sending ? t('plus.sending') : t('plus.send')}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}

// Shown above the checklist. It says plainly that the list is not editable on screen,
// and offers a way to tell us if a paid, editable version would be useful.
export function ResultNotice() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    // Put focus back where it came from.
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <div className="shrink-0 bg-slate-50 px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.08)]">
      <div className="mx-auto max-w-3xl flex flex-col gap-2.5">
        <p className="flex items-start gap-3 text-base text-slate-700 leading-snug">
          <Info className="w-5 h-5 mt-0.5 shrink-0 text-slate-500" aria-hidden />
          <span>
            <strong className="font-semibold text-slate-800">{t('steps.result.downloadNote.title')}</strong>{' '}
            {t('steps.result.downloadNote.body')}
          </span>
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 pl-8">
          <p className="text-base text-slate-600 leading-snug">{t('plus.prompt')}</p>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            className="self-start shrink-0 bg-white text-seed-700 text-base font-semibold px-4 py-2 rounded-lg shadow-[0_0_0_1px_rgba(124,92,58,0.45)] hover:bg-slate-100 transition-colors"
          >
            {t('plus.cta')}
          </button>
        </div>
      </div>
      {open && <PlusDialog onClose={close} />}
    </div>
  );
}
