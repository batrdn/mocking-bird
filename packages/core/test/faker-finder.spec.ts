import { FakerFinder } from '../src/faker/faker-finder';
import { FakerCandidate, FieldType, NonArrayFieldType } from '../src';

describe('Faker Finder', () => {
  const fakerFinder = new FakerFinder();

  const search = (
    fieldName: string,
    type: NonArrayFieldType
  ): { faker: FakerCandidate; score?: number } => {
    const searchResult = fakerFinder.search(fieldName, type);
    return searchResult[0];
  };

  it('should search for the firstName', () => {
    const bestCandidate = search('firstName', FieldType.STRING);
    expect(bestCandidate.faker.method).toBe('firstName');
    expect(bestCandidate.score).toBeLessThan(0.5);
  });

  it('should search for the creditCardNumber', () => {
    const bestCandidate = search('creditCard', FieldType.STRING);
    expect(bestCandidate.faker.method).toBe('creditCardNumber');
    expect(bestCandidate.score).toBeLessThan(0.5);
  });

  it('should search for the email', () => {
    const bestCandidate = search('userEmail', FieldType.STRING);
    expect(bestCandidate.faker.method).toBe('email');
    expect(bestCandidate.score).toBeLessThan(0.5);
  });

  it('should search for the number field of amount field', () => {
    const bestCandidate = search('amount', FieldType.NUMBER);
    expect(bestCandidate.faker.method).toBe('amount');

    const value = bestCandidate.faker.callback();
    expect(typeof value).toBe('number');
  });

  it('should search for the string field of amount field', () => {
    const bestCandidate = search('amount', FieldType.STRING);
    expect(bestCandidate.faker.method).toBe('amount');

    const value = bestCandidate.faker.callback();
    expect(typeof value).toBe('string');
  });
});
