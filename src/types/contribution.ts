import { z } from 'zod';
import { FoodItemSchema } from '../schemas/foodDatasetSchema';

export const ContributionPayloadSchema = z.object({
  entry: FoodItemSchema,
  submitterNotes: z.string().max(500).optional(),
});

export type ContributionPayload = z.infer<typeof ContributionPayloadSchema>;

export type ErrorKind = 'rateLimit' | 'server' | 'validation' | 'network' | 'unknown';

export type SubmissionState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; issueUrl: string }
  | { status: 'error'; message: string; kind: ErrorKind };
