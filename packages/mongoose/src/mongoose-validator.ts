import { Rule, Validator, Value } from '@mocking-bird/core';
import { SchemaType, Validator as MongooseValidatorType } from 'mongoose';

/**
 * MongooseValidator is a class that extends the Validator class and provides functionalities to validate mongoose
 * schema types and rules.
 */
export class MongooseValidator extends Validator {
  constructor() {
    super();
  }

  /**
   * Validates a generated value against both the schema type and the custom rule
   *
   * @param schemaType The schema type to validate the value against.
   * @param value The value to validate.
   * @param rule The custom rule to validate the value against.
   *
   * @throws {Error} If the value does not comply with the schema type or the custom rule.
   */
  validateValue(
    schemaType: SchemaType,
    value: Value | undefined,
    rule: Rule | undefined,
  ): void {
    this.validateValueBySchema(value, schemaType);

    if (rule) {
      super.validate(value, rule);
    }
  }

  /**
   * Parses mongoose schema rules or validators to a rule object.
   *
   * @param schemaRules The mongoose schema rules to parse.
   *
   * @returns The parsed rule object.
   */
  parseValidators(
    schemaRules: (MongooseValidatorType & {
      enumValues?: (string | number)[];
      min?: number;
      max?: number;
    })[],
  ): Rule | undefined {
    if (!schemaRules.length) {
      return undefined;
    }

    return schemaRules.reduce((acc, validator) => {
      switch (validator.type) {
        case 'required':
          return { ...acc, required: true };
        case 'enum':
          return validator.enumValues?.length
            ? { ...acc, enum: validator.enumValues }
            : acc;
        case 'min':
          return Number.isInteger(validator.min)
            ? { ...acc, min: validator.min }
            : acc;
        case 'max':
          return Number.isInteger(validator.max)
            ? { ...acc, max: validator.max }
            : acc;
        default:
          return acc;
      }
    }, {} as Rule);
  }

  /**
   * Validates the custom rule against the schema rule.
   *
   * @param schemaRule The mongoose schema rule.
   * @param rule The custom rule to validate against the schema rule.
   */
  validateRules(schemaRule: Rule, rule: Rule): void {
    this.checkRequiredRule(schemaRule, rule);
    this.checkMinMaxRule(schemaRule.min, rule.min, 'min');
    this.checkMinMaxRule(schemaRule.max, rule.max, 'max');
    this.checkEnumValues(schemaRule, rule);
  }

  /**
   * Combines the schema rule and the custom rule.
   *
   * @param schemaRule The mongoose schema rule.
   * @param rule The custom rule to combine with the schema rule.
   *
   * @returns The combined rule.
   */
  combineRules(
    schemaRule: Rule | undefined,
    rule: Rule | undefined,
  ): Rule | undefined {
    if (!schemaRule) {
      return rule;
    }

    if (!rule) {
      return schemaRule;
    }

    return { ...schemaRule, ...rule };
  }

  /**
   * Validates a generated value against the mongoose schema rules or validators.
   *
   * @param value The value to validate.
   * @param schemaType The mongoose schema type to validate the value against.
   *
   * @throws {Error} If the value does not comply with the schema rule.
   *
   * @private
   */
  private validateValueBySchema(
    value: Value | undefined,
    schemaType: SchemaType,
  ): void {
    const schemaRule = this.parseValidators(schemaType.validators);

    if (schemaRule) {
      super.validate(value, schemaRule);
    }
  }

  /**
   * Validates the `required` rule for both the schema and the custom rule.
   * If the mongoose rule defines the field as required, the custom rule cannot override it to be non-required.
   *
   * @param schemaRule The mongoose schema rule.
   * @param rule The custom rule to validate against the schema rule.
   *
   * @throws {Error} If the custom rule overrides the required field in the mongoose schema to be non-required.
   *
   * @private
   */
  private checkRequiredRule(schemaRule: Rule, rule: Rule): void {
    if (!!schemaRule.required && rule.required === false) {
      throw new Error(
        'Forbidden: required field cannot be overridden to be non-required',
      );
    }
  }

  /**
   * Checks the `min` and `max` rules for both the schema and the custom rule.
   *
   * @example
   *
   * - If the mongoose schema defines the `min` value as 5, the custom rule cannot override it to be less than 5.
   * - If the mongoose schema defines the `max` value as 10, the custom rule cannot override it to be greater than 10.
   * - if the mongoose schema defines the `max` value as 10, the custom `min` rule cannot override it to be greater
   * than 10.
   * - if the mongoose schema defines the `min` value as 5, the custom `max` rule cannot override it to be less than 5.
   *
   * @param schemaValue The value of the `min` or `max` rule in the mongoose schema.
   * @param ruleValue The value of the `min` or `max` rule in the custom rule.
   * @param type The type of the rule, i.e., `min` or `max`.
   *
   * @throws {Error} If the custom rule breaks the `min` or `max` rule in the mongoose schema.
   *
   * @private
   */
  private checkMinMaxRule(
    schemaValue: number | undefined,
    ruleValue: number | undefined,
    type: 'min' | 'max',
  ): void {
    if (schemaValue && ruleValue) {
      const invalidCondition =
        type === 'max' ? schemaValue < ruleValue : schemaValue > ruleValue;

      if (invalidCondition) {
        throw new Error(
          `Forbidden: ${type} value cannot be overridden to be ${
            type === 'max' ? 'greater' : 'less'
          } than the schema ${type} value`,
        );
      }
    }
  }

  /**
   * Validates the `enum` rule for both the schema and the custom rule.
   *
   * @param schemaRule The mongoose schema rule.
   * @param rule The custom rule to validate against the schema rule.
   *
   * @throws {Error} If the custom rule overrides the `enum` rule in the mongoose schema to include values not in
   * the schema rule.
   *
   * @private
   */
  private checkEnumValues(schemaRule: Rule, rule: Rule): void {
    if (schemaRule.enum && rule.enum) {
      const invalidEnumValues = rule.enum.filter(
        (value) => !schemaRule.enum?.includes(value),
      );

      if (invalidEnumValues.length) {
        throw new Error(
          `Forbidden: enum values cannot be overridden to include values not in the schema enum: ${invalidEnumValues.join(
            ', ',
          )}`,
        );
      }
    }
  }
}
