import { Validator } from '../src';

describe('Validator', () => {
  const validator = new Validator();

  it('should validate required field', () => {
    expect(() => {
      validator.validate(undefined, { path: 'age', required: true });
    }).toThrow('Required field "age" is undefined');
  });

  it('should validate enum', () => {
    expect(() => {
      validator.validate('D', { path: 'enum', enum: ['A', 'B', 'C'] });
    }).toThrow("Value 'D' does not match any of the allowed enum values");
  });

  it('should validate min', () => {
    expect(() => {
      validator.validate(17, { path: 'age', min: 18 });
    }).toThrow("Value '17' is less than the minimum allowed value of 18");
  });

  it('should validate max', () => {
    expect(() => {
      validator.validate(100, { path: 'age', max: 99 });
    }).toThrow("Value '100' exceeds the maximum allowed value of 99");
  });

  it('should validate size', () => {
    expect(() => {
      validator.validate([1, 2, 3, 4, 5, 6], { path: 'array', size: 5 });
    }).toThrow("Size of '[1,2,3,4,5,6]' does not match the required size of 5");
  });

  it('should validate pattern', () => {
    expect(() => {
      validator.validate('D', { path: 'enum', pattern: /A|B/ });
    }).toThrow("Value 'D' does not match the required pattern");
  });
});
