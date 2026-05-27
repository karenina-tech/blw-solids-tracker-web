import { validateAgeTool, checkBLWReadiness } from '../../src/domain/validateAge';

const ALL_MILESTONES = {
  headControl: true,
  canSitWithMinimalSupport: true,
  reachAndGrab: true,
  showsInterestInFood: true,
};

describe('validateAgeTool', () => {
  it('blocks babies under 5 months', () => {
    const result = validateAgeTool({ ageMonths: 3, developmentalMilestones: ALL_MILESTONES });
    expect(result.safetyStatus).toBe('BLOCKED_NOT_READY');
    expect(result.success).toBe(false);
  });

  it('blocks 4-month-old regardless of milestones', () => {
    const result = validateAgeTool({ ageMonths: 4, developmentalMilestones: ALL_MILESTONES });
    expect(result.safetyStatus).toBe('BLOCKED_NOT_READY');
  });

  it('requires feeding type when baby is 5 months', () => {
    const result = validateAgeTool({ ageMonths: 5, developmentalMilestones: ALL_MILESTONES });
    expect(result.safetyStatus).toBe('REQUIRES_FEEDING_TYPE');
  });

  it('blocks 5-month exclusive breastfeeding', () => {
    const result = validateAgeTool({
      ageMonths: 5,
      developmentalMilestones: ALL_MILESTONES,
      feedingType: 'exclusive_breastfeeding',
    });
    expect(result.safetyStatus).toBe('BLOCKED_NOT_READY');
    expect(result.success).toBe(false);
  });

  it('approves 5-month formula-fed baby', () => {
    const result = validateAgeTool({
      ageMonths: 5,
      developmentalMilestones: ALL_MILESTONES,
      feedingType: 'formula',
    });
    expect(result.safetyStatus).toBe('APPROVED');
    expect(result.success).toBe(true);
  });

  it('approves 6-month-old without feeding type', () => {
    const result = validateAgeTool({ ageMonths: 6, developmentalMilestones: ALL_MILESTONES });
    expect(result.safetyStatus).toBe('APPROVED');
    expect(result.success).toBe(true);
  });

  it('approves 9-month-old', () => {
    const result = validateAgeTool({ ageMonths: 9, developmentalMilestones: ALL_MILESTONES });
    expect(result.safetyStatus).toBe('APPROVED');
  });
});

describe('checkBLWReadiness', () => {
  it('is not ready when head control is missing', () => {
    const r = checkBLWReadiness(6, { ...ALL_MILESTONES, headControl: false });
    expect(r.isReady).toBe(false);
    expect(r.milestonesOk).toBe(false);
  });

  it('is not ready when sitting milestone is missing', () => {
    const r = checkBLWReadiness(6, { ...ALL_MILESTONES, canSitWithMinimalSupport: false });
    expect(r.isReady).toBe(false);
  });

  it('is not ready when reach/grab is missing', () => {
    const r = checkBLWReadiness(6, { ...ALL_MILESTONES, reachAndGrab: false });
    expect(r.isReady).toBe(false);
  });

  it('is ready even when showsInterestInFood is false (informational only)', () => {
    const r = checkBLWReadiness(6, { ...ALL_MILESTONES, showsInterestInFood: false });
    expect(r.isReady).toBe(true);
  });

  it('requires feeding type for 5-month-old when undefined', () => {
    const r = checkBLWReadiness(5, ALL_MILESTONES, undefined);
    expect(r.requiresFeedingType).toBe(true);
    expect(r.isReady).toBe(false);
  });
});
