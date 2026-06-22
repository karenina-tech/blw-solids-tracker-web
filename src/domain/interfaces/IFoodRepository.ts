import type { FoodItem } from '@/types/food';

export interface IFoodRepository {
  getAll(): FoodItem[];
}
