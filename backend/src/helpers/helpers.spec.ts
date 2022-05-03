import { describe, it, expect } from '@jest/globals';
import { priceCalc } from './helpers';

describe('priceCalc', () => {
  it('returns the correct price if it exceeds the radius', () => {
    const result = priceCalc(50000);
    expect(result).toBe(1875);
  });

  it('returns the correct price if distance is within the radius', () => {
    const result = priceCalc(10000);
    expect(result).toBe(1250);
  });
});
