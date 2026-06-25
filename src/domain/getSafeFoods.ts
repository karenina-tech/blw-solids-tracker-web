import { BabyProfileSchema, type BabyProfile } from '@/types/profile';
import type { FoodItem } from '@/types/food';
import type { IFoodRepository } from '@/domain/interfaces/IFoodRepository';
import type { IProfileValidator } from '@/domain/interfaces/IProfileValidator';
import { getGuidelines } from '@/config/guidelines';

export type MissingMilestone = 'headControl' | 'canSitWithMinimalSupport' | 'reachAndGrab';

export type SafeFoodsResult =
  | {
      success: false;
      safetyStatus: 'BLOCKED_NOT_READY';
      reason: 'exclusive_breastfeeding' | 'age_too_young' | 'milestones_incomplete';
      missingMilestones?: MissingMilestone[];
      babyName: string;
    }
  | {
      success: true;
      safetyStatus: 'APPROVED';
      babyName: string;
      totalAvailableSafeFoods: number;
      showFoodInterestNote: boolean;
      foods: FoodItem[];
    };

export function getSafeFoodsTool(
  repo: IFoodRepository,
  validator: IProfileValidator,
  input: { profile: BabyProfile }
): SafeFoodsResult {
  const validation = BabyProfileSchema.safeParse(input.profile);
  if (!validation.success) {
    return {
      success: false,
      safetyStatus: 'BLOCKED_NOT_READY',
      reason: 'milestones_incomplete',
      babyName: input.profile.name ?? '',
    };
  }

  const profile = validation.data;
  const readiness = validator.checkReadiness(
    profile.ageMonths,
    profile.developmentalMilestones,
    profile.feedingType
  );

  if (!readiness.isReady) {
    const { ageRules, developmentalMilestones } = getGuidelines();
    const isEarlyWindowNotApproved =
      ageRules.earlyWindowMonths.includes(profile.ageMonths) &&
      profile.feedingType !== undefined &&
      !ageRules.earlyWindowApprovedFeedingTypes.includes(profile.feedingType);

    if (isEarlyWindowNotApproved) {
      return {
        success: false,
        safetyStatus: 'BLOCKED_NOT_READY',
        reason: 'exclusive_breastfeeding',
        babyName: profile.name,
      };
    }

    if (!readiness.ageOk) {
      return {
        success: false,
        safetyStatus: 'BLOCKED_NOT_READY',
        reason: 'age_too_young',
        babyName: profile.name,
      };
    }

    const missingMilestones = developmentalMilestones.required.filter(
      (key) => !profile.developmentalMilestones[key]
    ) as MissingMilestone[];

    return {
      success: false,
      safetyStatus: 'BLOCKED_NOT_READY',
      reason: 'milestones_incomplete',
      missingMilestones: missingMilestones.length > 0 ? missingMilestones : undefined,
      babyName: profile.name,
    };
  }

  const safeFoods = validator.filterSafeFoods(repo.getAll(), profile);

  return {
    success: true,
    safetyStatus: 'APPROVED',
    babyName: profile.name,
    totalAvailableSafeFoods: safeFoods.length,
    showFoodInterestNote: !profile.developmentalMilestones.showsInterestInFood,
    foods: safeFoods,
  };
}
