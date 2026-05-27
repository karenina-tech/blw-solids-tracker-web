import { generate30DayPlan } from '../../src/domain/blwEngine';
import { FOOD_DATASET } from '../../src/data/foodDataset';
import type { FoodItem } from '../../src/schemas/foodDatasetSchema';

const ALL_FOODS = FOOD_DATASET;
const START_DATE = '2025-09-01';

describe('generate30DayPlan', () => {
  it('produces exactly 30 items', () => {
    const plan = generate30DayPlan(ALL_FOODS, START_DATE, 6);
    expect(plan).toHaveLength(30);
  });

  it('assigns sequential dates starting from startDate', () => {
    const plan = generate30DayPlan(ALL_FOODS, START_DATE, 6);
    expect(plan[0].date).toBe('2025-09-01');
    expect(plan[1].date).toBe('2025-09-02');
    expect(plan[29].date).toBe('2025-09-30');
  });

  it('always has at least 2 standard foods before any allergen', () => {
    const plan = generate30DayPlan(ALL_FOODS, START_DATE, 6);
    const firstAllergenIndex = plan.findIndex((item) => item.category.startsWith('Allergen'));
    expect(firstAllergenIndex).toBeGreaterThanOrEqual(2);
  });

  it('each allergen appears in 3 consecutive days', () => {
    const plan = generate30DayPlan(ALL_FOODS, START_DATE, 6);
    let i = 0;
    while (i < plan.length) {
      if (plan[i].category === 'Allergen (1/3)') {
        expect(plan[i + 1]?.category).toBe('Allergen (2/3)');
        expect(plan[i + 2]?.category).toBe('Allergen (3/3)');
        i += 3;
      } else {
        i++;
      }
    }
  });

  it('isAllergenFirstDay is only true on Allergen (1/3) days', () => {
    const plan = generate30DayPlan(ALL_FOODS, START_DATE, 6);
    plan.forEach((item) => {
      if (item.isAllergenFirstDay) {
        expect(item.category).toBe('Allergen (1/3)');
      }
      if (item.category === 'Allergen (1/3)') {
        expect(item.isAllergenFirstDay).toBe(true);
      }
    });
  });

  it('all items start with isOffered false and no notes', () => {
    const plan = generate30DayPlan(ALL_FOODS, START_DATE, 6);
    plan.forEach((item) => {
      expect(item.isOffered).toBe(false);
      expect(item.hasAllergyReaction).toBe(false);
      expect(item.notes).toBe('');
    });
  });

  it('works with a minimal food list (no allergens)', () => {
    const standards = ALL_FOODS.filter((f): f is FoodItem => f.category === 'Standard').slice(0, 5);
    const plan = generate30DayPlan(standards, START_DATE, 6);
    expect(plan).toHaveLength(30);
    plan.forEach((item) => expect(item.category).toBe('Standard'));
  });

  it('uses 9-12 preparation for a 9-month-old', () => {
    const singleFood: FoodItem[] = [{
      id: 'avocado',
      name: 'Avocado',
      category: 'Standard',
      minAgeMonths: 6,
      preparationByAge: {
        '6-9': 'Ripe strips the size of an adult pinky finger.',
        '9-12': 'Small diced cubes to practice pincer grasp.',
      },
    }];
    const plan = generate30DayPlan(singleFood, START_DATE, 9);
    expect(plan[0].foodItem).toContain('Small diced cubes');
  });
});
