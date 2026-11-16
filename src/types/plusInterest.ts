import { z } from 'zod';

export const PLUS_PLANS = ['monthly', 'six_month', 'not_sure'] as const;
export type PlusPlan = (typeof PLUS_PLANS)[number];

export const PLUS_PLAN_LABELS: Record<PlusPlan, string> = {
  monthly: 'Monthly',
  six_month: '6-month pass',
  not_sure: 'Not sure yet',
};

// Same checks in the browser and on the server. Messages are shown to the parent.
export const PlusInterestSchema = z.object({
  email: z
    .string('emailRequired')
    .trim()
    .min(1, 'emailRequired')
    .pipe(z.email('emailInvalid').max(254, 'emailInvalid')),
  plan: z.enum(PLUS_PLANS, 'planRequired'),
  wish: z.string().trim().max(500, 'wishTooLong').optional(),
  consent: z.literal(true, 'consentRequired'),
  locale: z.enum(['en', 'es']).default('en'),
  // Honeypot: people never see this field, bots fill it in.
  website: z.string().max(0).default(''),
});

export type PlusInterestInput = z.input<typeof PlusInterestSchema>;
export type PlusInterestFieldErrors = Partial<Record<'email' | 'plan' | 'wish' | 'consent', string>>;
