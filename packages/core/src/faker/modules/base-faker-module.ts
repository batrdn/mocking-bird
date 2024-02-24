import { FakerCandidate, Rule } from '../../types';
import { faker } from '@faker-js/faker';
import { FakerHelpers } from '../faker-helpers';

export abstract class BaseFakerModule {
  abstract toFakerCandidates(): FakerCandidate[];

  protected convertToInt(str: string, rule?: Rule): number {
    const num = parseInt(str);
    return Number.isNaN(num)
      ? faker.number.int(
          rule?.size ? rule.size : FakerHelpers.getMinMaxRule(rule)
        )
      : num;
  }

  protected convertToFloat(str: string, rule?: Rule): number {
    const num = parseFloat(str);
    return Number.isNaN(num)
      ? faker.number.float(
          rule?.size ? rule.size : FakerHelpers.getMinMaxRule(rule)
        )
      : num;
  }
}
