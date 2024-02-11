import { FieldPath, FieldType, FixtureOptions, Rule, Value } from './types';
import { AbstractTypeMapper } from './abstract-type-mapper';
import { Validator } from './validator';
import { AbstractPathFinder } from './path-finder';
import { faker } from '@faker-js/faker';

export abstract class AbstractFixture<T> {
  protected pathfinder: AbstractPathFinder;
  protected typeMapper: AbstractTypeMapper;
  protected validator: Validator;

  protected constructor(
    pathfinder: AbstractPathFinder,
    typeMapper: AbstractTypeMapper
  ) {
    this.pathfinder = pathfinder;
    this.typeMapper = typeMapper;
    this.validator = new Validator();
  }

  abstract generate(
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions
  ): T;

  protected generateSingleValue(
    fieldPath: string,
    type: FieldType,
    rule?: Rule,
    arrayType?: Exclude<FieldType, FieldType.ARRAY>
  ): Value {

    return faker.number.int();
  }
}
