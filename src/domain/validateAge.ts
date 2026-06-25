import { z } from 'zod';
import { MilestoneSchema } from '@/types/profile';
import { TOOL_MESSAGES } from '@/data/toolMessages';
import { getGuidelines } from '@/config/guidelines';

const ValidateAgeInputSchema = z.object({
  ageMonths: z.number().min(0).max(12),
  developmentalMilestones: MilestoneSchema,
  feedingType: z.enum(['formula', 'exclusive_breastfeeding']).optional(),
});

type ValidateAgeInput = z.infer<typeof ValidateAgeInputSchema>;

export function checkBLWReadiness(
  ageMonths: number,
  milestones: z.infer<typeof MilestoneSchema>,
  feedingType?: 'formula' | 'exclusive_breastfeeding'
) {
  const { ageRules, developmentalMilestones } = getGuidelines();
  const isEarlyWindow = ageRules.earlyWindowMonths.includes(ageMonths);

  if (isEarlyWindow && feedingType === undefined) {
    return { isReady: false, ageOk: false, milestonesOk: false, requiresFeedingType: true };
  }

  const ageOk =
    ageMonths >= ageRules.standardMinimumMonths ||
    (isEarlyWindow && ageRules.earlyWindowApprovedFeedingTypes.includes(feedingType!));

  const milestonesOk = developmentalMilestones.required.every(
    (key) => milestones[key]
  );

  return { isReady: ageOk && milestonesOk, ageOk, milestonesOk, requiresFeedingType: false };
}

export function validateAgeTool(input: ValidateAgeInput) {
  const validation = ValidateAgeInputSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: 'Invalid input', details: validation.error };
  }

  const { ageMonths, feedingType } = validation.data;
  const { ageRules } = getGuidelines();
  const isEarlyWindow = ageRules.earlyWindowMonths.includes(ageMonths);

  if (isEarlyWindow && feedingType === undefined) {
    return {
      success: false,
      safetyStatus: 'REQUIRES_FEEDING_TYPE',
      message: 'Baby is 5 months old — feeding type required to determine eligibility.',
    };
  }

  const ageOk =
    ageMonths >= ageRules.standardMinimumMonths ||
    (isEarlyWindow && ageRules.earlyWindowApprovedFeedingTypes.includes(feedingType ?? ''));

  if (!ageOk) {
    const isEarlyWindowNotApproved =
      isEarlyWindow &&
      feedingType !== undefined &&
      !ageRules.earlyWindowApprovedFeedingTypes.includes(feedingType);
    return {
      success: false,
      safetyStatus: 'BLOCKED_NOT_READY',
      ageOk: false,
      note: isEarlyWindowNotApproved
        ? TOOL_MESSAGES.EXCLUSIVE_BREASTFEEDING_NOTE
        : TOOL_MESSAGES.AGE_TOO_YOUNG_NOTE,
    };
  }

  const isEarlyApproved =
    isEarlyWindow && ageRules.earlyWindowApprovedFeedingTypes.includes(feedingType ?? '');
  return {
    success: true,
    safetyStatus: 'APPROVED',
    ageOk: true,
    note: isEarlyApproved ? TOOL_MESSAGES.FORMULA_5M_DISCLAIMER : undefined,
  };
}
