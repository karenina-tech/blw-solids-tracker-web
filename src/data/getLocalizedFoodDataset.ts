import { FOOD_DATASET } from '@/data/foodDataset';
import { FOOD_TRANSLATIONS_ES, type FoodTranslation } from '@/data/foodTranslations.es';
import type { FoodItem } from '@/types/food';

const TRANSLATIONS: Record<string, Record<string, FoodTranslation>> = {
	es: FOOD_TRANSLATIONS_ES
};

export function getLocalizedFoodDataset(language: string): FoodItem[] {
	const translations = TRANSLATIONS[language];
	if (!translations) return FOOD_DATASET;

	return FOOD_DATASET.map((food) => {
		const translation = translations[food.id];
		if (!translation) return food;
		return {
			...food,
			name: translation.name,
			chokingHazardWarning: translation.chokingHazardWarning ?? food.chokingHazardWarning,
			preparationByAge: { ...food.preparationByAge, ...translation.preparationByAge }
		};
	});
}
