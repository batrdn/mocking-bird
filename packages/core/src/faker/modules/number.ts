import { BaseFakerModule } from './base-faker-module';
import { FakerCandidate, FieldType, Rule, Value } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';
import { FakerHelpers } from '../faker-helpers';

export class NumberModule extends BaseFakerModule {
  private number(): FakerCandidate {
    return {
      type: FieldType.NUMBER,
      method: 'number',
      callback: (rule: Rule | undefined) =>
        faker.number.int(
          rule?.size ? rule.size : FakerHelpers.getMinMaxRule(rule)
        ),
    };
  }

  private bigNumber(): FakerCandidate {
    return {
      type: FieldType.BIGINT,
      method: 'number',
      callback: (rule: Rule | undefined) =>
        faker.number.bigInt(
          rule?.size ? rule.size : FakerHelpers.getMinMaxRule(rule)
        ),
    };
  }

  private binary(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'binary',
      callback: (rule: Rule | undefined) =>
        faker.number.binary(rule?.size ? rule.size : 1024),
    };
  }

  private octal(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'octal',
      callback: (rule: Rule | undefined) =>
        faker.number.octal(rule?.size ? rule.size : 1024),
    };
  }

  private hex(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'hex',
      callback: (rule: Rule | undefined) =>
        faker.number.hex(rule?.size ? rule.size : 1024),
    };
  }

  override toFakerCandidates(): FakerCandidate[] {
    return [
      this.number(),
      this.bigNumber(),
      this.binary(),
      this.octal(),
      this.hex(),
    ];
  }
}
