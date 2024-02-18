import {
  FieldPath,
  FieldType,
  FixtureOptions,
  NonArrayFieldType,
  Rule,
  Value,
} from './types';
import { AbstractTypeMapper } from './abstract-type-mapper';
import { Validator } from './validator';
import { AbstractPathFinder } from './path-finder';
import { FakerApi } from './faker';

export abstract class AbstractFixture<T> {
  private readonly fakerApi: FakerApi;

  protected pathfinder: AbstractPathFinder;
  protected typeMapper: AbstractTypeMapper;
  protected validator: Validator;

  protected constructor(
    pathfinder: AbstractPathFinder,
    typeMapper: AbstractTypeMapper,
    validator?: Validator
  ) {
    this.pathfinder = pathfinder;
    this.typeMapper = typeMapper;
    this.validator = validator ? validator : new Validator();

    this.fakerApi = new FakerApi(this.validator);
  }

  abstract bulkGenerate(
    size: number,
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions
  ): T[];

  abstract generate(
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions
  ): T;

  protected generateSingleValue(
    fieldPath: FieldPath,
    type: NonArrayFieldType,
    rule?: Rule,
    isAccurate = true
  ): Value {
    this.validatePath(fieldPath);
    const field = this.getRelevantField(fieldPath);

    return this.fakerApi.generate(field, type, rule, isAccurate);
  }

  protected generateArrayValue(
    fieldPath: FieldPath,
    type: NonArrayFieldType,
    rule?: Rule,
    isAccurate = true
  ): Value[] {
    this.validatePath(fieldPath);

    if (rule?.size) {
      return Array.from({ length: rule.size }, () =>
        this.fakerApi.generate(
          this.getRelevantField(fieldPath),
          type,
          rule,
          isAccurate
        )
      );
    }

    return [
      this.fakerApi.generate(
        this.getRelevantField(fieldPath),
        type,
        rule,
        isAccurate
      ),
    ];
  }

  private validatePath(path: FieldPath): void {
    if (!this.pathfinder.isValidPath(path)) {
      throw new Error(`Invalid path: ${path}`);
    }
  }

  private getRelevantField(path: FieldPath): string {
    const relevantPath = path.split('.').pop();
    if (!relevantPath) {
      throw new Error(`Invalid path: ${path}`);
    }

    return relevantPath;
  }
}
