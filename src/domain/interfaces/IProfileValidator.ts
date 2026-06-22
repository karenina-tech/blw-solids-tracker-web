import type { FoodItem } from '@/types/food';
import type { BabyProfile } from '@/types/profile';

export type ReadinessResult = {
  isReady: boolean;
  ageOk: boolean;
  milestonesOk: boolean;
  requiresFeedingType: boolean;
};

export interface IProfileValidator {
  checkReadiness(
    ageMonths: number,
    milestones: BabyProfile['developmentalMilestones'],
    feedingType?: BabyProfile['feedingType']
  ): ReadinessResult;
  filterSafeFoods(foods: FoodItem[], profile: BabyProfile): FoodItem[];
}
