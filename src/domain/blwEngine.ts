import type { FoodItem } from '../schemas/foodDatasetSchema';
import type { ChecklistItem } from '../@types/feeding';

type ScheduledDay = {
  food: FoodItem;
  allergenTrialDay?: 1 | 2 | 3;
};

function getPreparationForAge(preparationByAge: Record<string, string>, ageMonths: number): string {
  const entries = Object.entries(preparationByAge);
  for (const [range, instruction] of entries) {
    const [minAge, maxAge] = range.split('-').map(Number);
    if (ageMonths >= minAge && ageMonths < maxAge) {
      return instruction;
    }
  }
  const allInstructions = Object.values(preparationByAge);
  return allInstructions[allInstructions.length - 1] ?? '';
}

function shiftDateByDays(date: string, daysToAdd: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + daysToAdd);
  return d.toISOString().slice(0, 10);
}

function getAllergenDayLabel(trialDay: 1 | 2 | 3): ChecklistItem['category'] {
  if (trialDay === 1) return 'Allergen (1/3)';
  if (trialDay === 2) return 'Allergen (2/3)';
  return 'Allergen (3/3)';
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generate30DayPlan(foods: FoodItem[], startDate: string, ageMonths: number): ChecklistItem[] {
  const allergens = shuffle(foods.filter((food) => food.category === 'Allergen'));
  const mildStandards = shuffle(foods.filter((food) => food.category === 'Standard' && !food.chokingHazardWarning));
  const otherStandards = shuffle(foods.filter((food) => food.category === 'Standard' && !!food.chokingHazardWarning));
  const orderedStandards = [...mildStandards, ...otherStandards];
  const cyclingPool = orderedStandards.length > 0 ? orderedStandards : foods;
  let cycleIndex = 0;

  function nextStandardFood(): FoodItem {
    const food = cyclingPool[cycleIndex % cyclingPool.length];
    cycleIndex++;
    return food;
  }

  const schedule: ScheduledDay[] = [];

  for (let i = 0; i < 2 && schedule.length < 30; i++) {
    schedule.push({ food: nextStandardFood() });
  }

  for (const allergen of allergens) {
    if (schedule.length >= 30) break;
    schedule.push({ food: allergen, allergenTrialDay: 1 });
    if (schedule.length < 30) schedule.push({ food: allergen, allergenTrialDay: 2 });
    if (schedule.length < 30) schedule.push({ food: allergen, allergenTrialDay: 3 });
    for (let i = 0; i < 3 && schedule.length < 30; i++) {
      schedule.push({ food: nextStandardFood() });
    }
  }

  while (schedule.length < 30) {
    schedule.push({ food: nextStandardFood() });
  }

  return schedule.map((day, index): ChecklistItem => {
    const preparation = getPreparationForAge(day.food.preparationByAge, ageMonths);
    let category: ChecklistItem['category'];
    if (day.allergenTrialDay) {
      category = getAllergenDayLabel(day.allergenTrialDay);
    } else {
      category = 'Standard';
    }
    const prefix = day.allergenTrialDay ? '⏰ ' : '';
    return {
      date: shiftDateByDays(startDate, index),
      foodItem: `${prefix}${day.food.name} — ${preparation}`,
      category,
      isAllergenFirstDay: day.allergenTrialDay === 1,
      isOffered: false,
      hasAllergyReaction: false,
      notes: '',
    };
  });
}
