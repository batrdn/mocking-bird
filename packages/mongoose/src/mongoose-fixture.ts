import { Model, Schema, SchemaType } from 'mongoose';
import {
  AbstractFixture,
  FieldPath,
  FieldType,
  FixtureOptions,
  GlobPathFinder,
  Rule,
  Value,
} from '@mocking-bird/core';
import { MongooseTypeMapper } from './mongoose-type-mapper';
import { MongooseValidator } from './mongoose-validator';

export class MongooseFixture<
  T extends Record<string, any>
> extends AbstractFixture<T> {
  private static readonly globalOptions: FixtureOptions = {};

  private static readonly NESTED_SCHEMA_INSTANCE = 'Embedded';
  private static readonly ARRAY_SCHEMA_INSTANCE = 'Array';
  private static readonly VERSION_KEY = '__v';

  private readonly schema: Schema<T>;
  private readonly mongooseValidator: MongooseValidator;

  /**
   * @param model - The Mongoose model or schema to generate fixtures for.
   * If a model is provided, the schema will be extracted from it, e.g., a model created with
   * `mongoose.model('ModelName', schema)`.
   *
   * If a schema is provided, it will be used directly.
   */
  constructor(model: Model<T> | Schema<T>) {
    const pathfinder = new GlobPathFinder();
    const mongooseTypeMapper = new MongooseTypeMapper();
    const mongooseValidator = new MongooseValidator();

    super(pathfinder, mongooseTypeMapper, mongooseValidator);

    this.schema = this.isModel(model) ? model.schema : model;
    this.mongooseValidator = mongooseValidator;
  }

  static setGlobalOptions(options: FixtureOptions): void {
    Object.assign(MongooseFixture.globalOptions, options);
  }

  override bulkGenerate(
    size: number,
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions
  ): T[] {
    const combinedOptions = this.preGeneration(overrideValues, options);

    return Array.from({ length: size }, () =>
      this.recursivelyGenerateValue(
        this.schema as Schema,
        undefined,
        overrideValues,
        combinedOptions
      )
    );
  }

  override generate(
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions
  ): T {
    const combinedOptions = this.preGeneration(overrideValues, options);

    return this.recursivelyGenerateValue(
      this.schema as Schema,
      undefined,
      overrideValues,
      combinedOptions
    );
  }

  private recursivelyGenerateValue(
    schemaNode: Schema<T>,
    rootPath: FieldPath | undefined,
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions
  ): T {
    const generated = {};

    schemaNode.eachPath((path, schemaType) => {
      if (this.isExcluded(path, schemaType, options)) {
        return;
      }

      const subPath = rootPath
        ? this.pathfinder.createPath(rootPath, path)
        : path;

      const generatedValue = this.generateValueForSchemaType(
        subPath,
        schemaType,
        overrideValues,
        options
      );

      Object.assign(generated, { [path]: generatedValue });
    });

    return generated as T;
  }

  private generateValueForSchemaType(
    path: FieldPath,
    schemaType: SchemaType,
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions
  ): Value | undefined {
    if (schemaType.schema) {
      return this.generateValueForNestedSchema(
        path,
        schemaType,
        overrideValues,
        options
      );
    }

    return this.generateValue(path, schemaType, overrideValues, options);
  }

  private generateValueForNestedSchema(
    path: FieldPath,
    schemaType: SchemaType,
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions
  ): Value | undefined {
    if (schemaType.instance === MongooseFixture.NESTED_SCHEMA_INSTANCE) {
      return this.recursivelyGenerateValue(
        schemaType.schema,
        path,
        overrideValues,
        options
      );
    }

    if (schemaType.instance === MongooseFixture.ARRAY_SCHEMA_INSTANCE) {
      return this.generateValueForSchemaArray(
        path,
        schemaType,
        overrideValues,
        options
      );
    }

    return undefined;
  }

  private generateValueForSchemaArray(
    path: FieldPath,
    schemaType: SchemaType,
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions
  ): Value[] {
    const rule = this.pathfinder.findRule(path, options?.rules);

    if (rule?.size) {
      return Array.from({ length: rule.size }, () =>
        this.recursivelyGenerateValue(
          schemaType.schema,
          path,
          overrideValues,
          options
        )
      );
    }

    return [
      this.recursivelyGenerateValue(
        schemaType.schema,
        path,
        overrideValues,
        options
      ),
    ];
  }

  private generateValue(
    path: FieldPath,
    schemaType: SchemaType,
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions
  ): Value | undefined {
    const rule = this.pathfinder.findRule(path, options?.rules);

    const value = this.shouldOverride(path, overrideValues)
      ? this.overrideValue(path, overrideValues)
      : this.generateMockValue(path, schemaType, rule, options?.isAccurate);

    this.mongooseValidator.validateValue(path, value, schemaType, rule);

    return value;
  }

  private generateMockValue(
    path: FieldPath,
    schemaType: SchemaType,
    rule?: Rule,
    isAccurate = true
  ): Value | undefined {
    const type = this.typeMapper.getType(schemaType.instance);
    const combinedRule = this.mongooseValidator.combineRules(
      schemaType.validators,
      rule
    );

    if (type === FieldType.ARRAY) {
      const { caster } = schemaType as Schema.Types.Array;

      return caster?.instance
        ? this.generateArrayValue(
            path,
            this.typeMapper.getArrayType(caster.instance),
            combinedRule,
            isAccurate
          )
        : undefined;
    }

    return this.generateSingleValue(path, type, combinedRule, isAccurate);
  }

  private overrideValue(
    path: FieldPath,
    overrideValues: Record<FieldPath, Value> | undefined
  ): Value | undefined {
    if (!overrideValues) {
      return undefined;
    }

    const overrideValuePatterns = Object.keys(overrideValues);
    const matchingPatterns = this.pathfinder.findPatterns(
      path,
      overrideValuePatterns
    );

    if (matchingPatterns.length > 1) {
      throw new Error(
        `Forbidden: multiple override values found for path '${path}': ${matchingPatterns.join(
          ', '
        )}`
      );
    }

    const overrideKey = matchingPatterns[0];

    return overrideValues.hasOwnProperty(overrideKey)
      ? overrideValues[overrideKey]
      : undefined;
  }

  private preGeneration(
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions
  ): FixtureOptions {
    const extractedPaths = this.extractPaths(overrideValues, options);
    this.pathfinder.validatePaths(extractedPaths);

    if (!options) {
      return MongooseFixture.globalOptions;
    }

    return Object.assign({}, MongooseFixture.globalOptions, options);
  }

  private isExcluded(
    path: FieldPath,
    schemaType: SchemaType,
    options?: FixtureOptions
  ): boolean {
    // Immediately return true if only required fields are needed and the current field is not required.
    // Also, return true if the current field is the version key (__v).
    if (path === MongooseFixture.VERSION_KEY || options?.requiredOnly && !schemaType.isRequired) {
      return true;
    }

    if (!options?.exclude?.length) {
      return false;
    }

    const isExist = this.pathfinder.exists(path, options.exclude);

    if (isExist && schemaType.isRequired) {
      throw new Error(`Cannot exclude required field: ${path}`);
    }

    return isExist;
  }

  private shouldOverride(
    path: FieldPath,
    overrideValues: Record<FieldPath, Value> | undefined
  ): boolean {
    return (
      !!overrideValues &&
      this.pathfinder.exists(path, Object.keys(overrideValues))
    );
  }

  private extractPaths(
    overrideValues: Record<FieldPath, Value> | undefined,
    options: FixtureOptions | undefined
  ): FieldPath[] {
    const overridePaths = overrideValues ? Object.keys(overrideValues) : [];
    const excludePaths = options?.exclude || [];
    const rulePaths = options?.rules?.map(({ path }) => path) || [];

    return [...overridePaths, ...excludePaths, ...rulePaths];
  }

  private isModel(model: Model<T> | Schema<T>): model is Model<T> {
    return (model as Model<T>).schema !== undefined;
  }
}
