import { z } from 'zod';

const VALID_AGE_RANGES = ['6-9', '9-12'] as const;

export const ContributionEntrySchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Must be a lowercase slug (e.g. "sweet-potato")'),
  name: z.string().min(1).max(100),
  category: z.enum(['Standard', 'Allergen']),
  minAgeMonths: z.number().int().min(0).max(12),
  preparationByAge: z
    .record(z.string(), z.string())
    .refine((obj) => Object.keys(obj).length > 0, {
      message: 'At least one preparation range is required',
    })
    .refine(
      (obj) => Object.keys(obj).every((k) => (VALID_AGE_RANGES as readonly string[]).includes(k)),
      { message: `Keys must be one of: ${VALID_AGE_RANGES.join(', ')}` }
    )
    .refine((obj) => Object.values(obj).every((v) => v.trim().length > 0), {
      message: 'Preparation instructions cannot be empty',
    }),
  dietaryType: z.enum(['vegan', 'vegetarian', 'standard']).optional(),
  chokingHazardWarning: z.string().min(1).max(500).optional(),
});

export const ContributionPayloadSchema = z.object({
  entry: ContributionEntrySchema,
  submitterNotes: z.string().max(500).optional(),
});

export type ValidatedPayload = z.infer<typeof ContributionPayloadSchema>;
