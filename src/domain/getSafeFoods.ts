import { FOOD_DATASET } from '../data/foodDataset';
import { TOOL_MESSAGES } from '../data/toolMessages';
import { BabyProfileSchema, type BabyProfile } from '../schemas/profileSchema';
import { checkBLWReadiness } from './validateAge';

interface ToolInput {
  profile: BabyProfile;
}

export function getSafeFoodsTool(input: ToolInput) {
  const validation = BabyProfileSchema.safeParse(input.profile);
  if (!validation.success) {
    return {
      success: false,
      error: 'Invalid profile data format.',
      details: validation.error,
    };
  }

  const profile = validation.data;

  const readiness = checkBLWReadiness(profile.ageMonths, profile.developmentalMilestones, profile.feedingType);
  if (!readiness.isReady) {
    const missing: string[] = [];
    if (!profile.developmentalMilestones.headControl)              missing.push("hasn't developed full head control yet");
    if (!profile.developmentalMilestones.canSitWithMinimalSupport) missing.push("isn't sitting upright with minimal support yet");
    if (!profile.developmentalMilestones.reachAndGrab)             missing.push("hasn't started reaching and grabbing yet");

    const markerList = missing.length > 0
      ? missing.map((m) => `• ${profile.name} ${m}`).join('\n')
      : '• does not meet one or more physical readiness markers';

    const note =
      `Thank you for taking the time to go through this with me.\n\n` +
      `Based on what you shared, it looks like ${profile.name} might need just a little more time before starting solid foods. ` +
      `This is completely normal — every baby develops at their own pace, and there is no rush!\n\n` +
      `Here is what we noticed:\n${markerList}\n\n` +
      `The good news is that most babies reach these milestones within the next few weeks. ` +
      `Starting solids at the right moment makes the whole experience safer and more enjoyable for both of you.\n\n` +
      `Come back whenever ${profile.name} is ready — we will be here!`;

    return {
      success: false,
      safetyStatus: 'BLOCKED_NOT_READY',
      note,
    };
  }

  const effectiveAge = profile.ageMonths === 5 && profile.feedingType === 'formula' ? 6 : profile.ageMonths;
  const DIET_LEVEL: Record<string, number> = { standard: 0, vegetarian: 1, vegan: 2 };
  const safeFoods = FOOD_DATASET.filter((food) => {
    const satisfiesAge = effectiveAge >= food.minAgeMonths;
    const isUserAllergic = profile.allergicFoods.some(
      (allergy) =>
        food.id.toLowerCase() === allergy.toLowerCase() ||
        food.name.toLowerCase() === allergy.toLowerCase()
    );
    const satisfiesDiet = DIET_LEVEL[food.dietaryType ?? 'vegan'] >= DIET_LEVEL[profile.dietType];
    return satisfiesAge && !isUserAllergic && satisfiesDiet;
  });

  const foodInterestNote = !profile.developmentalMilestones.showsInterestInFood
    ? TOOL_MESSAGES.FOOD_INTEREST_NOTE
    : undefined;

  return {
    success: true,
    safetyStatus: 'APPROVED',
    babyName: profile.name,
    totalAvailableSafeFoods: safeFoods.length,
    foodInterestNote,
    foods: safeFoods,
  };
}
