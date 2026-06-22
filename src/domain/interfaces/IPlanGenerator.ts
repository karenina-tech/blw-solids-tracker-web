import type { FoodItem } from '@/types/food';
import type { ChecklistItem } from '@/types/checklist';

export interface IPlanGenerator {
  generate(foods: FoodItem[], startDate: string, ageMonths: number): ChecklistItem[];
}
