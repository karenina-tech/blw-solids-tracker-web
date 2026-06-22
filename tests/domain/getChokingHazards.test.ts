import { getChokingHazardsTool } from '@/domain/getChokingHazards';
import { defaultFoodRepository } from '@/domain/services/foodRepository';

function tool(input: { ageMonths: number; feedingType?: 'formula' | 'exclusive_breastfeeding' }) {
  return getChokingHazardsTool(defaultFoodRepository, input) as any;
}

describe('getChokingHazardsTool — age gate', () => {
	it('blocks a 4-month-old — preparation rules are only shared after BLW readiness is confirmed', () => {
		const result = tool({ ageMonths: 4 });
		expect(result.success).toBe(false);
		expect(result.safetyStatus).toBe('BLOCKED_NOT_READY');
	});

	it('requires feeding type when baby is 5 months', () => {
		const result = tool({ ageMonths: 5 });
		expect(result.success).toBe(false);
		expect(result.safetyStatus).toBe('REQUIRES_FEEDING_TYPE');
	});

	it('blocks a 5-month-old on exclusive breastfeeding', () => {
		const result = tool({ ageMonths: 5, feedingType: 'exclusive_breastfeeding' });
		expect(result.success).toBe(false);
		expect(result.safetyStatus).toBe('BLOCKED_NOT_READY');
	});

	it('approves a 5-month-old on formula and returns preparation rules', () => {
		const result = tool({ ageMonths: 5, feedingType: 'formula' });
		expect(result.success).toBe(true);
		expect(result.safetyStatus).toBe('APPROVED');
		expect(result.preparationRules).toBeDefined();
		expect(result.preparationRules.length).toBeGreaterThan(0);
	});

	it('approves a 6-month-old and returns preparation rules', () => {
		const result = tool({ ageMonths: 6 });
		expect(result.success).toBe(true);
		expect(result.safetyStatus).toBe('APPROVED');
		expect(result.preparationRules.length).toBeGreaterThan(0);
	});
});

describe('getChokingHazardsTool — preparation rules shape', () => {
	it('every rule contains id, name, chokingHazardWarning, and safePreparation', () => {
		const result = tool({ ageMonths: 6 });
		result.preparationRules.forEach((rule: any) => {
			expect(typeof rule.id).toBe('string');
			expect(typeof rule.name).toBe('string');
			expect(typeof rule.chokingHazardWarning).toBe('string');
			expect(typeof rule.safePreparation).toBe('string');
			expect(rule.chokingHazardWarning.length).toBeGreaterThan(0);
			expect(rule.safePreparation.length).toBeGreaterThan(0);
		});
	});

	it('only returns foods that have a choking hazard warning', () => {
		const result = tool({ ageMonths: 6 });
		result.preparationRules.forEach((rule: any) => {
			expect(rule.chokingHazardWarning).toBeTruthy();
		});
	});

	it('uses age-appropriate preparation for a 6-month-old (apple should say steamed/baked)', () => {
		const result = tool({ ageMonths: 6 });
		const apple = result.preparationRules.find((r: any) => r.id === 'apple');
		expect(apple).toBeDefined();
		expect(apple.safePreparation.toLowerCase()).toContain('steamed');
	});

	it('uses age-appropriate preparation for a 9-month-old (apple should say grated/stewed)', () => {
		const result = tool({ ageMonths: 9 });
		const apple = result.preparationRules.find((r: any) => r.id === 'apple');
		expect(apple).toBeDefined();
		expect(apple.safePreparation.toLowerCase()).toMatch(/grated|stewed/);
	});

	it('5-month formula-fed baby receives the same preparation rules as a 6-month-old', () => {
		const formula = tool({ ageMonths: 5, feedingType: 'formula' });
		const sixMonth = tool({ ageMonths: 6 });
		expect(formula.preparationRules.length).toBe(sixMonth.preparationRules.length);
		formula.preparationRules.forEach((rule: any, i: number) => {
			expect(rule.safePreparation).toBe(sixMonth.preparationRules[i].safePreparation);
		});
	});
});
