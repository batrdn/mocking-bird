import { Rule, Value } from './types';

/**
 * A class that provides utility methods for validating values against rules.
 */
export class Validator {
  /**
   * Validate a value against a rule.
   *
   * @remarks
   *
   * - enum: if a rule has an enum, the value must be one of the enum values.
   * - min: if a rule has a min, the value must be greater than or equal to the min.
   * - max: if a rule has a max, the value must be less than or equal to the max.
   * - size: if a rule has a size, the value must have the same length as the size.
   * - pattern: if a rule has a pattern, the value must match the pattern.
   * - required: if a rule has `required` set to true, the value must not be undefined.
   *
   * @param value The value to validate.
   * @param rule The rule to validate against.
   *
   * @throws An error if the value does not comply with the rule.
   */
  validate(value: Value | undefined, rule: Rule): void {
    const pathStr = JSON.stringify(rule.path);

    if (rule.required && value === undefined) {
      throw new Error(`Required field ${pathStr} is undefined`);
    }

    if (value) {
      this.validateEnum(value, rule);
      this.validateMin(value, rule);
      this.validateMax(value, rule);
      this.validateSize(value, rule);
      this.validatePattern(value, rule);
    }
  }

  private validateEnum(value: Value, rule: Rule): void {
    if (
      rule.enum &&
      (typeof value === 'string' || typeof value === 'number') &&
      !rule.enum.includes(value)
    ) {
      throw new Error(
        `Value '${value}' does not match any of the allowed enum values`,
      );
    }
  }

  private validateMin(value: Value, rule: Rule): void {
    if (
      typeof value === 'number' &&
      rule.min !== undefined &&
      value < rule.min
    ) {
      throw new Error(
        `Value '${value}' is less than the minimum allowed value of ${rule.min}`,
      );
    }
  }

  private validateMax(value: Value, rule: Rule): void {
    if (
      typeof value === 'number' &&
      rule.max !== undefined &&
      value > rule.max
    ) {
      throw new Error(
        `Value '${value}' exceeds the maximum allowed value of ${rule.max}`,
      );
    }
  }

  private validateSize(value: Value, rule: Rule): void {
    if (
      (typeof value === 'string' || Array.isArray(value)) &&
      rule.size !== undefined
    ) {
      const size = value.length;

      if (size !== rule.size) {
        throw new Error(
          `Size of '${
            Array.isArray(value) ? `[${value}]` : value
          }' does not match the required size of ${rule.size}`,
        );
      }
    }
  }

  private validatePattern(value: Value, rule: Rule): void {
    if (
      typeof value === 'string' &&
      rule.pattern &&
      !rule.pattern.test(value)
    ) {
      throw new Error(`Value '${value}' does not match the required pattern`);
    }
  }
}
