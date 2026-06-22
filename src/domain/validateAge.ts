import { z } from 'zod';
import { MilestoneSchema } from '@/types/profile';
import { TOOL_MESSAGES } from '@/data/toolMessages';

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
  if (ageMonths === 5 && feedingType === undefined) {
    return { isReady: false, ageOk: false, milestonesOk: false, requiresFeedingType: true };
  }

  const ageOk = ageMonths >= 6 || (ageMonths === 5 && feedingType === 'formula');

  const milestonesOk =
    milestones.headControl &&
    milestones.canSitWithMinimalSupport &&
    milestones.reachAndGrab;

  return { isReady: ageOk && milestonesOk, ageOk, milestonesOk, requiresFeedingType: false };
}

export function validateAgeTool(input: ValidateAgeInput) {
  const validation = ValidateAgeInputSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: 'Invalid input', details: validation.error };
  }

  const { ageMonths, feedingType } = validation.data;

  if (ageMonths === 5 && feedingType === undefined) {
    return {
      success: false,
      safetyStatus: 'REQUIRES_FEEDING_TYPE',
      message: 'Baby is 5 months old — feeding type required to determine eligibility.',
    };
  }

  const ageOk = ageMonths >= 6 || (ageMonths === 5 && feedingType === 'formula');

  if (!ageOk) {
    const isBreastfeedingBlock = ageMonths === 5 && feedingType === 'exclusive_breastfeeding';
    return {
      success: false,
      safetyStatus: 'BLOCKED_NOT_READY',
      ageOk: false,
      note: isBreastfeedingBlock
        ? TOOL_MESSAGES.EXCLUSIVE_BREASTFEEDING_NOTE
        : TOOL_MESSAGES.AGE_TOO_YOUNG_NOTE,
    };
  }

  const isEarlyFormula = ageMonths === 5 && feedingType === 'formula';
  return {
    success: true,
    safetyStatus: 'APPROVED',
    ageOk: true,
    note: isEarlyFormula ? TOOL_MESSAGES.FORMULA_5M_DISCLAIMER : undefined,
  };
}
