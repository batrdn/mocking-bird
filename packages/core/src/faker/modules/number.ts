import { AbstractFakerModule } from './abstract-faker-module';
import { FakerCandidate, FieldType, Rule, Value } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';
import { FakerHelpers } from '../faker-helpers';

export class NumberModule extends AbstractFakerModule {
  private number(): FakerCandidate {
    return {
      type: FieldType.NUMBER,
      method: 'number',
      callback: (rule?: Rule) =>
        faker.number.int(
          rule?.size ? rule.size : FakerHelpers.getMinMaxRule(rule)
        ),
    };
  }

  private bigNumber(): FakerCandidate {
    return {
      type: FieldType.BIGINT,
      method: 'number',
      callback: (rule?: Rule) =>
        faker.number.bigInt(
          rule?.size ? rule.size : FakerHelpers.getMinMaxRule(rule)
        ),
    };
  }

  private binary(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'binary',
      callback: (rule?: Rule) =>
        faker.number.binary(rule?.size ? rule.size : 1024),
    };
  }

  private octal(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'octal',
      callback: (rule?: Rule) =>
        faker.number.octal(rule?.size ? rule.size : 1024),
    };
  }

  private hex(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'hex',
      callback: (rule?: Rule) =>
        faker.number.hex(rule?.size ? rule.size : 1024),
    };
  }

  toFakerCandidates(): FakerCandidate[] {
    return [
      this.number(),
      this.bigNumber(),
      this.binary(),
      this.octal(),
      this.hex(),
    ];
  }
}
