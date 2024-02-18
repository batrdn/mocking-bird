import { Rule, Validator, Value } from '@mocking-bird/core';
import { SchemaType, Validator as MongooseValidatorType } from 'mongoose';

export class MongooseValidator extends Validator {
  constructor() {
    super();
  }

  validateValue(
    path: string,
    value: Value | undefined,
    schemaType: SchemaType,
    rule?: Rule
  ) {
    this.validateValueBySchema(path, value, schemaType);

    if (rule) {
      super.validate(value, rule);
    }
  }

  combineRules(
    schemaRules: (MongooseValidatorType & {
      enumValues?: (string | number)[];
      min?: number;
      max?: number;
    })[],
    rule?: Rule
  ): Rule | undefined {
    if (!schemaRules.length) {
      return rule;
    }

    const schemaRule = this.parseValidators(schemaRules);

    if (!rule) {
      return schemaRule;
    }

    this.validateRules(schemaRule, rule);
    return { ...schemaRule, ...rule };
  }

  private validateValueBySchema(
    path: string,
    value: Value | undefined,
    schemaType: SchemaType
  ) {
    if (value === undefined && schemaType.isRequired) {
      throw new Error(`Required field '${path}' is undefined`);
    }

    schemaType.validators.forEach((validator) => {
      if (!validator?.validator?.(value)) {
        throw new Error(`Validation failed for field '${path}': ${value}`);
      }
    });
  }

  private parseValidators(
    schemaRules: (MongooseValidatorType & {
      enumValues?: (string | number)[];
      min?: number;
      max?: number;
    })[]
  ): Rule {
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

  private validateRules(schemaRule: Rule, rule: Rule): void {
    this.checkRequiredRule(schemaRule, rule);
    this.checkMinMaxRule(schemaRule.min, rule.min, 'min');
    this.checkMinMaxRule(schemaRule.max, rule.max, 'max');
    this.checkEnumValues(schemaRule, rule);
  }

  private checkRequiredRule(schemaRule: Rule, rule: Rule): void {
    if (!!schemaRule.required && rule.required === false) {
      throw new Error(
        'Forbidden: required field cannot be overridden to be non-required'
      );
    }
  }

  private checkMinMaxRule(
    schemaValue: number | undefined,
    ruleValue: number | undefined,
    type: 'min' | 'max'
  ): void {
    if (schemaValue && ruleValue) {
      const invalidCondition =
        type === 'max' ? schemaValue < ruleValue : schemaValue > ruleValue;

      if (invalidCondition) {
        throw new Error(
          `Forbidden: ${type} value cannot be overridden to be ${
            type === 'max' ? 'greater' : 'less'
          } than the schema ${type} value`
        );
      }
    }
  }

  private checkEnumValues(schemaRule: Rule, rule: Rule): void {
    if (schemaRule.enum && rule.enum) {
      const invalidEnumValues = rule.enum.filter(
        (value) => !schemaRule.enum?.includes(value)
      );

      if (invalidEnumValues.length) {
        throw new Error(
          `Forbidden: enum values cannot be overridden to include values not in the schema enum: ${invalidEnumValues.join(
            ', '
          )}`
        );
      }
    }
  }
}
