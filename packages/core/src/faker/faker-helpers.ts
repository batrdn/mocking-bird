import { Rule } from '@mocking-bird/core';

export class FakerHelpers {
  static getMinMaxRule(rule?: Rule) {
    return {
      min: rule?.min,
      max: rule?.max,
    };
  }

  static getStringRule(rule?: Rule) {
    if (rule?.size) {
      return rule.size;
    }

    if (rule?.min && rule?.max) {
      return {
        length: {
          min: rule?.min,
          max: rule?.max
        },
      };
    }

    if (rule?.min || rule?.max) {
      return { length: rule.min || rule.max };
    }

    return undefined;
  }
}
