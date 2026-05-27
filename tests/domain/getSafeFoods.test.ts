import { getSafeFoodsTool } from '../../src/domain/getSafeFoods';
import type { BabyProfile } from '../../src/schemas/profileSchema';

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

describe('getSafeFoodsTool', () => {
  it('approves a ready 6-month-old and returns foods', () => {
    const result = getSafeFoodsTool({ profile: BASE_PROFILE });
    expect(result.success).toBe(true);
    expect(result.safetyStatus).toBe('APPROVED');
    expect(result.foods).toBeDefined();
    expect((result.foods as unknown[]).length).toBeGreaterThan(0);
  });

  it('blocks when headControl is missing', () => {
    const profile = {
      ...BASE_PROFILE,
      developmentalMilestones: { ...BASE_PROFILE.developmentalMilestones, headControl: false },
    };
    const result = getSafeFoodsTool({ profile });
    expect(result.success).toBe(false);
    expect(result.safetyStatus).toBe('BLOCKED_NOT_READY');
    expect(result.note).toContain("Sofia hasn't developed full head control yet");
  });

  it('blocks when sitting milestone is missing', () => {
    const profile = {
      ...BASE_PROFILE,
      developmentalMilestones: {
        ...BASE_PROFILE.developmentalMilestones,
        canSitWithMinimalSupport: false,
      },
    };
    const result = getSafeFoodsTool({ profile });
    expect(result.success).toBe(false);
  });

  it('excludes allergic foods from the safe list', () => {
    const profile: BabyProfile = {
      ...BASE_PROFILE,
      knownAllergies: true,
      allergicFoods: ['peanut'],
    };
    const result = getSafeFoodsTool({ profile });
    expect(result.success).toBe(true);
    const foods = result.foods as { id: string }[];
    expect(foods.find((f) => f.id === 'peanut')).toBeUndefined();
  });

  it('vegan diet excludes meat and fish', () => {
    const veganProfile: BabyProfile = { ...BASE_PROFILE, dietType: 'vegan' };
    const standardProfile: BabyProfile = { ...BASE_PROFILE, dietType: 'standard' };
    const veganResult = getSafeFoodsTool({ profile: veganProfile });
    const standardResult = getSafeFoodsTool({ profile: standardProfile });
    const veganFoods = veganResult.foods as { id: string }[];
    const standardFoods = standardResult.foods as { id: string }[];
    expect(veganFoods.find((f) => f.id === 'beef')).toBeUndefined();
    expect(veganFoods.find((f) => f.id === 'fish')).toBeUndefined();
    expect(standardFoods.find((f) => f.id === 'beef')).toBeDefined();
  });

  it('vegetarian diet excludes meat but includes egg', () => {
    const vegProfile: BabyProfile = { ...BASE_PROFILE, dietType: 'vegetarian' };
    const result = getSafeFoodsTool({ profile: vegProfile });
    const foods = result.foods as { id: string }[];
    expect(foods.find((f) => f.id === 'beef')).toBeUndefined();
    expect(foods.find((f) => f.id === 'egg')).toBeDefined();
  });

  it('approves 5-month formula-fed baby with all milestones', () => {
    const profile: BabyProfile = {
      ...BASE_PROFILE,
      ageMonths: 5,
      feedingType: 'formula',
    };
    const result = getSafeFoodsTool({ profile });
    expect(result.success).toBe(true);
    expect(result.safetyStatus).toBe('APPROVED');
  });

  it('includes food interest note when showsInterestInFood is false', () => {
    const profile = {
      ...BASE_PROFILE,
      developmentalMilestones: {
        ...BASE_PROFILE.developmentalMilestones,
        showsInterestInFood: false,
      },
    };
    const result = getSafeFoodsTool({ profile });
    expect(result.success).toBe(true);
    expect(result.foodInterestNote).toBeDefined();
  });
});
