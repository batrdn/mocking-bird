import { FieldPath, FieldType, FixtureOptions, Rule, Value } from './types';

export abstract class CoreFixture<T> {
  abstract generate(
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions
  ): T;

  generateSingleValue(
    fieldPath: string,
    type: FieldType,
    rules: Rule[] = []
  ): Value {
    throw new Error('Not implemented');
  }
}
