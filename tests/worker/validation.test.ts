import { ContributionPayloadSchema } from '../../worker/src/validation';

const BASE_ENTRY = {
  id: 'mango',
  name: 'Mango',
  category: 'Standard' as const,
  minAgeMonths: 6,
  preparationByAge: {
    '6-9': 'Large thick slices.',
    '9-12': 'Small diced cubes.',
  },
};

describe('ContributionPayloadSchema — valid inputs', () => {
  it('accepts a minimal valid entry', () => {
    expect(ContributionPayloadSchema.safeParse({ entry: BASE_ENTRY }).success).toBe(true);
  });

  it('accepts an allergen entry with a choking hazard warning', () => {
    const result = ContributionPayloadSchema.safeParse({
      entry: { ...BASE_ENTRY, category: 'Allergen', chokingHazardWarning: 'Always flatten.' },
    });
    expect(result.success).toBe(true);
  });

  it('accepts optional dietaryType', () => {
    expect(
      ContributionPayloadSchema.safeParse({ entry: { ...BASE_ENTRY, dietaryType: 'vegan' } }).success
    ).toBe(true);
  });

  it('accepts submitter notes', () => {
    expect(
      ContributionPayloadSchema.safeParse({ entry: BASE_ENTRY, submitterNotes: 'Based on WHO guidelines.' }).success
    ).toBe(true);
  });

  it('accepts entry with only one age range', () => {
    expect(
      ContributionPayloadSchema.safeParse({
        entry: { ...BASE_ENTRY, preparationByAge: { '6-9': 'Thick slices.' } },
      }).success
    ).toBe(true);
  });
});

describe('ContributionPayloadSchema — id validation', () => {
  it('rejects an id with uppercase letters', () => {
    expect(ContributionPayloadSchema.safeParse({ entry: { ...BASE_ENTRY, id: 'Mango' } }).success).toBe(false);
  });

  it('rejects an id with spaces', () => {
    expect(ContributionPayloadSchema.safeParse({ entry: { ...BASE_ENTRY, id: 'sweet potato' } }).success).toBe(false);
  });

  it('rejects an empty id', () => {
    expect(ContributionPayloadSchema.safeParse({ entry: { ...BASE_ENTRY, id: '' } }).success).toBe(false);
  });

  it('accepts a hyphenated slug', () => {
    expect(ContributionPayloadSchema.safeParse({ entry: { ...BASE_ENTRY, id: 'sweet-potato' } }).success).toBe(true);
  });
});

describe('ContributionPayloadSchema — name validation', () => {
  it('rejects an empty name', () => {
    expect(ContributionPayloadSchema.safeParse({ entry: { ...BASE_ENTRY, name: '' } }).success).toBe(false);
  });
});

describe('ContributionPayloadSchema — category validation', () => {
  it('rejects an unknown category', () => {
    expect(ContributionPayloadSchema.safeParse({ entry: { ...BASE_ENTRY, category: 'Unknown' } }).success).toBe(false);
  });
});

describe('ContributionPayloadSchema — preparationByAge validation', () => {
  it('rejects an empty preparationByAge object', () => {
    expect(
      ContributionPayloadSchema.safeParse({ entry: { ...BASE_ENTRY, preparationByAge: {} } }).success
    ).toBe(false);
  });

  it('rejects an unsupported age range key', () => {
    expect(
      ContributionPayloadSchema.safeParse({
        entry: { ...BASE_ENTRY, preparationByAge: { '0-6': 'Too young.' } },
      }).success
    ).toBe(false);
  });

  it('rejects an empty preparation string', () => {
    expect(
      ContributionPayloadSchema.safeParse({
        entry: { ...BASE_ENTRY, preparationByAge: { '6-9': '  ' } },
      }).success
    ).toBe(false);
  });
});

describe('ContributionPayloadSchema — optional fields', () => {
  it('rejects an invalid dietaryType', () => {
    expect(
      ContributionPayloadSchema.safeParse({ entry: { ...BASE_ENTRY, dietaryType: 'pescatarian' } }).success
    ).toBe(false);
  });

  it('rejects submitter notes exceeding 500 characters', () => {
    expect(
      ContributionPayloadSchema.safeParse({ entry: BASE_ENTRY, submitterNotes: 'x'.repeat(501) }).success
    ).toBe(false);
  });

  it('rejects an empty choking hazard warning (if provided, must be non-empty)', () => {
    expect(
      ContributionPayloadSchema.safeParse({ entry: { ...BASE_ENTRY, chokingHazardWarning: '' } }).success
    ).toBe(false);
  });
});
