import { Rule } from '@mocking-bird/core';

export const getMinMaxRule = (rule?: Rule) => ({
  min: rule?.min,
  max: rule?.max,
});

export const getStringRule = (rule?: Rule) => {
  if (rule?.size) {
    return rule.size;
  }

  if (rule?.min && rule?.max) {
    return {
      min: rule?.min,
      max: rule?.max,
    };
  }

  return undefined;
};
