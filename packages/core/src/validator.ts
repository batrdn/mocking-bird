import { Rule, Value } from './types';

export class Validator {
  validate(value: Value | undefined, rule: Rule): void {
    const pathStr = JSON.stringify(rule.path);

    if (rule.required && value === undefined) {
      throw new Error(`Required field '${pathStr}' is undefined`);
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
    throw new Error('Not implemented');
  }

  private validateMin(value: Value, rule: Rule): void {
    throw new Error('Not implemented');
  }

  private validateMax(value: Value, rule: Rule): void {
    throw new Error('Not implemented');
  }

  private validateSize(value: Value, rule: Rule): void {
    throw new Error('Not implemented');
  }

  private validatePattern(value: Value, rule: Rule): void {
    throw new Error('Not implemented');
  }
}
