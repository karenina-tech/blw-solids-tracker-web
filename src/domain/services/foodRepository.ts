import { getLocalizedFoodDataset } from '@/data/getLocalizedFoodDataset';
import type { IFoodRepository } from '@/domain/interfaces/IFoodRepository';

export function createFoodRepository(language: string = 'en'): IFoodRepository {
  return {
    getAll: () => getLocalizedFoodDataset(language),
  };
}

export const defaultFoodRepository: IFoodRepository = createFoodRepository();
