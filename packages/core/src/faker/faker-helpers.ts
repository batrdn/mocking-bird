import { Rule } from '../types';

/**
 * A helper class that provides utility methods for faker.js.
 * Note: the methods and their return types are specific to faker.js library.
 */
export class FakerHelpers {
  static getMinMaxRule(
    rule: Rule | undefined,
    defaultValues?: {
      min: number;
      max: number;
    },
  ) {
    return {
      min: Number.isInteger(rule?.min) ? rule?.min : defaultValues?.min,
      max: Number.isInteger(rule?.max) ? rule?.max : defaultValues?.max,
    };
  }

  static getStringRule(rule: Rule | undefined) {
    if (rule?.size) {
      return rule.size;
    }

    if (rule?.min && rule?.max) {
      return {
        length: {
          min: rule?.min,
          max: rule?.max,
        },
      };
    }

    if (rule?.min || rule?.max) {
      return { length: rule.min || rule.max };
    }

    return undefined;
  }
}
