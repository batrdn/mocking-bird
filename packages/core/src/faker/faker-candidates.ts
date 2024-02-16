import {
  FakerCandidate,
  FieldType,
  NonArrayFieldType,
  Rule,
  Value,
} from '../types';
import { faker } from '@faker-js/faker';
import { getMinMaxRule, getStringRule } from './faker-helpers';

export const FAKER_CANDIDATES: FakerCandidate[] = [
  {
    type: FieldType.STRING,
    function: 'firstName',
    module: 'person',
    callback: (): Value => faker.person.firstName(),
  },
];

// TODO: Refactor
export const DEFAULT_FAKER_CANDIDATES: Record<
  NonArrayFieldType,
  (rule?: Rule) => Value
> = {
  [FieldType.STRING]: (rule?: Rule) => {
    if (rule?.enum) {
      return faker.helpers.arrayElement(rule.enum);
    }

    if (rule?.pattern) {
      return faker.helpers.fromRegExp(rule.pattern);
    }

    return faker.string.sample(getStringRule(rule));
  },
  [FieldType.NUMBER]: (rule?: Rule) => faker.number.int(getMinMaxRule(rule)),
  [FieldType.FLOAT]: (rule?: Rule) => faker.number.float(getMinMaxRule(rule)),
  [FieldType.BIGINT]: (rule?: Rule) => faker.number.bigInt(getMinMaxRule(rule)),
  [FieldType.BOOLEAN]: () => Math.random() < 0.5,
  // TODO: extend the date functionality to include min and max
  [FieldType.DATE]: () => faker.date.soon(),
  [FieldType.BUFFER]: (rule?: Rule) =>
    Buffer.from(faker.string.sample(getStringRule(rule))),
  [FieldType.MONGO_DB_ID]: () => faker.database.mongodbObjectId(),
  [FieldType.UUID]: () => faker.string.uuid(),
  [FieldType.OBJECT]: (rule?: Rule): any =>
    Array.from({ length: rule?.size ?? 3 }).reduce((obj: any, _) => {
      const key = faker.string.sample({
        min: 3,
        max: 10,
      });
      obj[key] = faker.string.sample();
      return obj;
    }, {}),
};
