import { z } from 'zod';

export const VALID_AGE_RANGES = ['6-9', '9-12'] as const;
export type AgeRange = (typeof VALID_AGE_RANGES)[number];

export const FoodItemSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Must be a lowercase slug (e.g. "sweet-potato", not "Sweet Potato")'),
  name: z.string().min(1, 'Name cannot be empty'),
  category: z.enum(['Standard', 'Allergen']),
  minAgeMonths: z
    .number({ message: 'Must be a number' })
    .int('Must be a whole number of months')
    .min(0)
    .max(12, 'Currently only foods for 0-12 months are supported'),
  preparationByAge: z
    .record(z.string(), z.string())
    .refine((obj) => Object.keys(obj).length > 0, {
      message: 'At least one preparation range is required',
    })
    .refine(
      (obj) => Object.keys(obj).every((k) => (VALID_AGE_RANGES as readonly string[]).includes(k)),
      { message: `Keys must be one of the supported age ranges: ${VALID_AGE_RANGES.join(', ')}` }
    )
    .refine((obj) => Object.values(obj).every((v) => v.trim().length > 0), {
      message: 'Preparation instructions cannot be empty',
    }),
  dietaryType: z.enum(['vegan', 'vegetarian', 'standard']).optional(),
  chokingHazardWarning: z.string().min(1, 'Must be a non-empty warning or omitted entirely').optional(),
});

export const FoodDatasetSchema = z.array(FoodItemSchema).min(1, 'Dataset cannot be empty');

export type FoodItem = z.infer<typeof FoodItemSchema>;
