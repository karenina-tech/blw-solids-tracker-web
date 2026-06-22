import { FOOD_DATASET } from '@/data/foodDataset';
import type { IFoodRepository } from '@/domain/interfaces/IFoodRepository';

export function createFoodRepository(): IFoodRepository {
  return {
    getAll: () => FOOD_DATASET,
  };
}

export const defaultFoodRepository: IFoodRepository = createFoodRepository();
