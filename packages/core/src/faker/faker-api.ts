import { FakerContext } from './faker-context';
import { Validator } from '../validator';
import { NonArrayFieldType, Rule, Value } from '../types';

/**
 * ### Overview
 *
 * FakerApi is a class that provides the functionality to generate fake data.
 * It is not directly tied to a specific fake data value generation libraries, such as faker.js and chance.js etc...
 * It is designed to abstract the fake data generation process and provide a consistent rule for generating fake data.
 */
export class FakerApi {
  private readonly validator: Validator;

  constructor(validator: Validator) {
    this.validator = validator;
  }

  /**
   * Generate a fake value based on the given field, type, and rule.
   *
   * @param field The field name to generate a fake value for, e.g., address, firstName, age etc...
   * @param type The type of the field.
   * @param rule The rule to generate the fake value.
   * @param isAccurate A flag to indicate if the fake value should be generated accurately based on the field name.
   *
   * @see FakerFinder#search
   *
   * @returns A fake value based on the given field, type, and rule. Falls back to the default fake value generation
   * if `isAccurate` is set to `false` or if no accurate match is found.
   */
  generate(
    field: string,
    type: NonArrayFieldType,
    rule: Rule | undefined,
    isAccurate = true
  ): Value {
    if (!isAccurate) {
      return this.generateDefault(type, rule);
    }

    const callback = FakerContext.getInstance().findCallback(field, type);

    if (callback) {
      const value = callback(rule);

      const isValidValue = this.isGeneratedValueValid(value, rule);
      // Fall back to the default value if the generated value does not comply with the rule
      return isValidValue ? value : this.generateDefault(type, rule);
    }

    return this.generateDefault(type, rule);
  }

  /**
   * Used for validating once more after a value is generated.
   *
   * @param value The generated value
   * @param rule The rule to validate against
   *
   * @returns true if valid, false otherwise
   *
   * @private
   */
  private isGeneratedValueValid(value: Value, rule: Rule | undefined): boolean {
    try {
      if (rule) {
        this.validator.validate(value, rule);
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  private generateDefault(
    type: NonArrayFieldType,
    rule: Rule | undefined
  ): Value {
    const callback = FakerContext.getInstance().getDefaultCallback(type);

    return callback(rule);
  }
}
