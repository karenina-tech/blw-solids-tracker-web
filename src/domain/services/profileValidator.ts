import { checkBLWReadiness } from '@/domain/validateAge';
import { getGuidelines } from '@/config/guidelines';
import type { IProfileValidator } from '@/domain/interfaces/IProfileValidator';
import type { BabyProfile } from '@/types/profile';
import type { FoodItem } from '@/types/food';

const DIET_LEVEL: Record<string, number> = { standard: 0, vegetarian: 1, vegan: 2 };

function filterSafeFoods(foods: FoodItem[], profile: BabyProfile): FoodItem[] {
  const { ageRules } = getGuidelines();
  const isEarlyApproved =
    ageRules.earlyWindowMonths.includes(profile.ageMonths) &&
    ageRules.earlyWindowApprovedFeedingTypes.includes(profile.feedingType ?? '');
  const effectiveAge = isEarlyApproved ? ageRules.earlyWindowEffectiveAgeMonths : profile.ageMonths;
  return foods.filter((food) => {
    const satisfiesAge = effectiveAge >= food.minAgeMonths;
    const isUserAllergic = profile.allergicFoods.some(
      (allergy) =>
        food.id.toLowerCase() === allergy.toLowerCase() ||
        food.name.toLowerCase() === allergy.toLowerCase()
    );
    const satisfiesDiet = DIET_LEVEL[food.dietaryType ?? 'vegan'] >= DIET_LEVEL[profile.dietType];
    return satisfiesAge && !isUserAllergic && satisfiesDiet;
  });
}

export function createProfileValidator(): IProfileValidator {
  return {
    checkReadiness: (ageMonths, milestones, feedingType) =>
      checkBLWReadiness(ageMonths, milestones, feedingType),
    filterSafeFoods: (foods, profile) => filterSafeFoods(foods, profile),
  };
}

export const defaultProfileValidator: IProfileValidator = createProfileValidator();
