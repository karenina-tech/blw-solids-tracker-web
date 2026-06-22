import { getSafeFoodsTool } from '@/domain/getSafeFoods';
import { defaultFoodRepository } from '@/domain/services/foodRepository';
import { defaultProfileValidator } from '@/domain/services/profileValidator';
import type { BabyProfile } from '@/types/profile';

const BASE_PROFILE: BabyProfile = {
  name: 'Sofia',
  ageMonths: 6,
  startDate: '2025-09-01',
  dietType: 'standard',
  knownAllergies: false,
  allergicFoods: [],
  developmentalMilestones: {
    headControl: true,
    canSitWithMinimalSupport: true,
    reachAndGrab: true,
    showsInterestInFood: true,
  },
};

function tool(profile: BabyProfile) {
  return getSafeFoodsTool(defaultFoodRepository, defaultProfileValidator, { profile });
}

describe('getSafeFoodsTool', () => {
  it('approves a ready 6-month-old and returns foods', () => {
    const result = tool(BASE_PROFILE);
    expect(result.success).toBe(true);
    expect(result.safetyStatus).toBe('APPROVED');
    if (!result.success) return;
    expect(result.foods).toBeDefined();
    expect(result.foods.length).toBeGreaterThan(0);
  });

  it('blocks when headControl is missing', () => {
    const profile = {
      ...BASE_PROFILE,
      developmentalMilestones: { ...BASE_PROFILE.developmentalMilestones, headControl: false },
    };
    const result = tool(profile);
    expect(result.success).toBe(false);
    expect(result.safetyStatus).toBe('BLOCKED_NOT_READY');
    if (result.success) return;
    expect(result.reason).toBe('milestones_incomplete');
    expect(result.missingMilestones).toContain('headControl');
  });

  it('blocks when sitting milestone is missing', () => {
    const profile = {
      ...BASE_PROFILE,
      developmentalMilestones: {
        ...BASE_PROFILE.developmentalMilestones,
        canSitWithMinimalSupport: false,
      },
    };
    const result = tool(profile);
    expect(result.success).toBe(false);
  });

  it('excludes allergic foods from the safe list', () => {
    const profile: BabyProfile = {
      ...BASE_PROFILE,
      knownAllergies: true,
      allergicFoods: ['peanut'],
    };
    const result = tool(profile);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.foods.find((f) => f.id === 'peanut')).toBeUndefined();
  });

  it('vegan diet excludes meat and fish', () => {
    const veganResult = tool({ ...BASE_PROFILE, dietType: 'vegan' });
    const standardResult = tool({ ...BASE_PROFILE, dietType: 'standard' });
    if (!veganResult.success || !standardResult.success) return;
    expect(veganResult.foods.find((f) => f.id === 'beef')).toBeUndefined();
    expect(veganResult.foods.find((f) => f.id === 'fish')).toBeUndefined();
    expect(standardResult.foods.find((f) => f.id === 'beef')).toBeDefined();
  });

  it('vegetarian diet excludes meat but includes egg', () => {
    const result = tool({ ...BASE_PROFILE, dietType: 'vegetarian' });
    if (!result.success) return;
    expect(result.foods.find((f) => f.id === 'beef')).toBeUndefined();
    expect(result.foods.find((f) => f.id === 'egg')).toBeDefined();
  });

  it('approves 5-month formula-fed baby with all milestones', () => {
    const result = tool({ ...BASE_PROFILE, ageMonths: 5, feedingType: 'formula' });
    expect(result.success).toBe(true);
    expect(result.safetyStatus).toBe('APPROVED');
  });

  it('shows food interest note when showsInterestInFood is false', () => {
    const profile = {
      ...BASE_PROFILE,
      developmentalMilestones: {
        ...BASE_PROFILE.developmentalMilestones,
        showsInterestInFood: false,
      },
    };
    const result = tool(profile);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.showFoodInterestNote).toBe(true);
  });
});
