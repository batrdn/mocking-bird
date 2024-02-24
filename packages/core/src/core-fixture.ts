import {
  FieldPath,
  FieldType,
  FixtureOptions,
  NonArrayFieldType,
  Rule,
  Value,
} from './types';
import { CoreTypeMapper } from './core-type-mapper';
import { Validator } from './validator';
import { CorePathFinder } from './path-finder';
import { FakerApi } from './faker';

/**
 * ### Overview
 *
 * CoreFixture is the abstract base class for all fixtures.
 * It provides the basic functionality for generating fake data.
 * Every fixture package should extend this class and implement the abstract methods:
 *
 * {@link CoreFixture#generate}
 * {@link CoreFixture#bulkGenerate}
 */
export abstract class CoreFixture<T> {
  private readonly fakerApi: FakerApi;

  protected pathfinder: CorePathFinder;
  protected typeMapper: CoreTypeMapper;
  protected validator: Validator;

  protected constructor(
    pathfinder: CorePathFinder,
    typeMapper: CoreTypeMapper,
    validator?: Validator
  ) {
    this.pathfinder = pathfinder;
    this.typeMapper = typeMapper;
    this.validator = validator ? validator : new Validator();

    this.fakerApi = new FakerApi(this.validator);
  }

  /**
   * @virtual
   *
   * @param size The number of mock data entries to generate.
   * @param overrideValues Optional key-value pair containing field paths and values to override.
   * @param options - Optional fixture options.
   *
   * @returns An array of mock data based on the given size and generic type.
   *
   * @public
   */
  abstract bulkGenerate(
    size: number,
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions
  ): T[];

  /**
   * @virtual
   *
   * @param overrideValues - Optional object containing field paths and values to override.
   * @param options - Optional fixture options.
   *
   * @returns A mock data entry based on the generic type.
   */
  abstract generate(
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions
  ): T;

  /**
   * Generates a single value, i.e., non array values, for the given field path and type.
   * If a rule is provided, it will be used to generate the value.
   * If `isAccurate` is set to `true` (default: true), the value will be generated with the highest possible
   * accuracy.
   *
   * @see FakerFinder#search
   * For more information on the accuracy of the generated values.
   *
   * @param fieldName The name of the field for which the value should be generated.
   * @param type The non array type of the field.
   * @param rule The rule to be used to generate the value.
   * @param isAccurate If set to `true`, the value will be generated with the highest possible accuracy.
   *
   * @returns A single mock value based on the given field name and type.
   *
   * @protected
   */
  protected generateSingleValue(
    fieldName: string,
    type: NonArrayFieldType,
    rule: Rule | undefined,
    isAccurate = true
  ): Value {
    return this.fakerApi.generate(fieldName, type, rule, isAccurate);
  }

  /**
   * Generates an array of values for the given field name and type.
   * If a rule is provided, it will be used to generate the values.
   * If `isAccurate` is set to `true` (default: true), the values will be generated with the highest possible accuracy.
   *
   * @see FakerFinder#search
   * For more information on the accuracy of the generated values.
   *
   * @param fieldName The name of the field for which the value should be generated.
   * @param type The non array type of the field, i.e., only the based types.
   * @param rule The rule to be used to generate the value.
   * @param isAccurate If set to `true`, the value will be generated with the highest possible accuracy.
   *
   * @returns An array of mock values based on the given field name and type.
   *
   * @protected
   */
  protected generateArrayValue(
    fieldName: string,
    type: NonArrayFieldType,
    rule: Rule | undefined,
    isAccurate = true
  ): Value[] {
    if (rule?.size) {
      return Array.from({ length: rule.size }, () =>
        this.fakerApi.generate(fieldName, type, rule, isAccurate)
      );
    }

    return [this.fakerApi.generate(fieldName, type, rule, isAccurate)];
  }
}
