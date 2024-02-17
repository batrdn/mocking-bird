import {
  FakerCallback,
  FieldType,
  NonArrayFieldType,
  Rule,
  Value,
} from '@mocking-bird/core';
import { faker } from '@faker-js/faker';
import { FakerHelpers } from './faker-helpers';

export class FakerFactory {
  private fakerMaps = new Map<NonArrayFieldType, FakerCallback>();

  constructor() {
    this.fakerMaps.set(FieldType.STRING, this.getStringCallback());
    this.fakerMaps.set(FieldType.NUMBER, this.getNumberCallback());
    this.fakerMaps.set(FieldType.BOOLEAN, this.getBooleanCallback());
    this.fakerMaps.set(FieldType.DATE, this.getDateCallback());
    this.fakerMaps.set(FieldType.BUFFER, this.getBufferCallback());
    this.fakerMaps.set(FieldType.BIGINT, this.getBigIntCallback());
    this.fakerMaps.set(FieldType.FLOAT, this.getFloatCallback());
    this.fakerMaps.set(FieldType.MONGO_DB_ID, this.getMongoDBIDCallback());
    this.fakerMaps.set(FieldType.UUID, this.getUUIDCallback());
    this.fakerMaps.set(FieldType.OBJECT, this.getObjectCallback());
  }

  getFakerCallback(type: NonArrayFieldType): FakerCallback {
    return this.fakerMaps.get(type)!;
  }

  private getStringCallback(): FakerCallback {
    return (rule?: Rule) => {
      if (rule?.enum) {
        return faker.helpers.arrayElement(rule.enum);
      }

      if (rule?.pattern) {
        return faker.helpers.fromRegExp(rule.pattern);
      }

      return faker.string.sample(FakerHelpers.getStringRule(rule));
    };
  }

  private getNumberCallback(): FakerCallback {
    return (rule?: Rule) => faker.number.int(FakerHelpers.getMinMaxRule(rule));
  }

  private getFloatCallback(): FakerCallback {
    return (rule?: Rule) =>
      faker.number.float(FakerHelpers.getMinMaxRule(rule));
  }

  private getBigIntCallback(): FakerCallback {
    return (rule?: Rule) =>
      faker.number.bigInt(FakerHelpers.getMinMaxRule(rule));
  }

  private getBooleanCallback(): FakerCallback {
    return () => Math.random() < 0.5;
  }

  // TODO: extend the date functionality to include min and max
  private getDateCallback(): FakerCallback {
    return () => faker.date.soon();
  }

  private getBufferCallback(): FakerCallback {
    return (rule?: Rule) =>
      Buffer.from(faker.string.sample(FakerHelpers.getStringRule(rule)));
  }

  private getMongoDBIDCallback(): FakerCallback {
    return () => faker.database.mongodbObjectId();
  }

  private getUUIDCallback(): FakerCallback {
    return () => faker.string.uuid();
  }

  private getObjectCallback(): FakerCallback {
    return (rule?: Rule): any =>
      Array.from({ length: rule?.size ?? 3 }).reduce((obj: any, _) => {
        const key = faker.word.sample({
          strategy: 'shortest',
        });
        obj[key] = faker.string.sample();
        return obj;
      }, {});
  }
}
