import { generate30DayPlan } from '@/domain/blwEngine';
import type { IPlanGenerator } from '@/domain/interfaces/IPlanGenerator';

export function createPlanGenerator(): IPlanGenerator {
  return {
    generate: (foods, startDate, ageMonths) => generate30DayPlan(foods, startDate, ageMonths),
  };
}

export const defaultPlanGenerator: IPlanGenerator = createPlanGenerator();
