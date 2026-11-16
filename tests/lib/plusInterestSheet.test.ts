import { toSheetCell } from '@/lib/plusInterestSheet';

describe('toSheetCell', () => {
  it.each(['=SUM(1,2)', '+1', '-1', '@cmd', '\t=x'])('adds an apostrophe before %p', (value) => {
    expect(toSheetCell(value)).toBe(`'${value}`);
  });

  it('leaves normal text alone', () => {
    expect(toSheetCell('reactions, favourite foods')).toBe('reactions, favourite foods');
  });

  it('turns missing text into an empty cell', () => {
    expect(toSheetCell(undefined)).toBe('');
  });
});
