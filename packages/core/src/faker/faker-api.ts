import { NonArrayFieldType, Rule, Value } from '../types';
import { FakerContext } from './faker-context';
import { Validator } from '@mocking-bird/core';

export class FakerApi {
  private readonly validator: Validator;

  constructor(validator: Validator) {
    this.validator = validator;
  }

  generate(
    field: string,
    type: NonArrayFieldType,
    rule?: Rule,
    isAccurate = true
  ): Value {
    if (!isAccurate) {
      return this.generateDefault(type, rule);
    }

    const callback = FakerContext.getInstance().findCallback(field, type);

    if (callback) {
      const value = callback(rule);
      const isValidValue = this.isGeneratedValueValid(value, rule);

      return isValidValue ? value : this.generateDefault(type, rule);
    }

    return this.generateDefault(type, rule);
  }

  private isGeneratedValueValid(value: Value, rule?: Rule): boolean {
    try {
      if (rule) {
        this.validator.validate(value, rule);
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  private generateDefault(type: NonArrayFieldType, rule?: Rule): Value {
    const callback = FakerContext.getInstance().getDefaultCallback(type);

    return callback(rule);
  }
}
