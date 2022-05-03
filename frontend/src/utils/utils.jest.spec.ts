import { describe, it, expect } from '@jest/globals';
import { createPinia, setActivePinia } from 'pinia';
import { useFrontEndStore } from 'src/stores/frontendStore';
import { formatLocation, required, sameEmail, validEmail } from './utils';

describe('required', () => {
  it('returns a string if an empty string argument was given', () => {
    const result = required('');
    expect(typeof result).toBe('string');
  });
  it('returns true if a non-empty string argument was given', () => {
    const result = required('g');
    expect(result).toBe(true);
  });
});

describe('validEmail', () => {
  it('returns a string if the given value is not a valid email', () => {
    const result = validEmail('abc@.com');
    expect(typeof result).toBe('string');
  });
  it('returns true if the given value is a valid email', () => {
    const result = validEmail('abc@valid.com');
    expect(result).toBe(true);
  });
});

describe('sameEmail', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const { customer } = useFrontEndStore();
    customer.email = 'bossMan@email.com';
  });
  it('returns a string if the emails are not equal', () => {
    const result = sameEmail('NotABoss@email.com');
    expect(typeof result).toBe('string');
  });
  it('returns true if the emails are equal', () => {
    const result = sameEmail('bossMan@email.com');
    expect(result).toBe(true);
  });
});

describe('formatLocation', () => {
  it('returns the string without a zip code', () => {
    const result = formatLocation('123 43 test');
    expect(result).toBe('test');
  });
  it("returns the string without a ', Sverige'", () => {
    const result = formatLocation('123 43 test, Sverige');
    expect(result).toBe('test');
  });
  it("returns the same string if there's no zip code", () => {
    const result = formatLocation('test');
    expect(result).toBe('test');
  });
});
