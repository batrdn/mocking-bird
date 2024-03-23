import { Model, Schema, SchemaType } from 'mongoose';
import {
  CoreFixture,
  FieldPath,
  FieldType,
  FixtureOptions,
  GlobPathFinder,
  NonArrayFieldType,
  Rule,
  Value,
} from '@mocking-bird/core';
import { MongooseTypeMapper } from './mongoose-type-mapper';
import { MongooseValidator } from './mongoose-validator';

/**
 * ### Overview
 *
 * MongooseFixture class extending abstract CoreFixture class for generating mock data based on Mongoose models
 * or schemas.
 *
 * @see CoreFixture
 *
 * @typeParam T The type of the document corresponding to the Mongoose model or schema.
 *
 * @example
 * const Model = mongoose.model<IDocumentType>('ModelName', schema);
 * const Schema = new mongoose.Schema({ name: String, age: Number });
 *
 * const modelFixture = new MongooseFixture(Model);
 * const schemaFixture = new MongooseFixture(Schema);
 *
 * const data = modelFixture.generate();
 * const multiple = schemaFixture.bulkGenerate(10);
 */
export class MongooseFixture<T> extends CoreFixture<T> {
  private static readonly globalOptions: FixtureOptions = {};

  private static readonly MONGOOSE_SPECIAL_CHARS_REGEX = /[.*$]/g;

  private static readonly NESTED_SCHEMA_INSTANCE = 'Embedded';
  private static readonly ARRAY_SCHEMA_INSTANCE = 'Array';
  private static readonly MAP_SCHEMA_INSTANCE = 'Map';
  private static readonly VERSION_KEY = '__v';

  private readonly schema: Schema<T>;
  private readonly mongooseValidator: MongooseValidator;

  /**
   * Constructs a MongooseFixture instance.
   *
   * @param target The Mongoose model or schema to generate fixtures for. If a model is provided, the schema is
   * extracted from it. If a schema is provided, it is used directly.
   */
  constructor(target: Model<T> | Schema<T>) {
    const pathfinder = new GlobPathFinder();
    const mongooseTypeMapper = new MongooseTypeMapper();
    const mongooseValidator = new MongooseValidator();

    super(pathfinder, mongooseTypeMapper, mongooseValidator);

    this.schema = this.isModel(target) ? target.schema : target;
    this.mongooseValidator = mongooseValidator;
  }

  /**
   * Sets global options for the fixture generation.
   *
   * @param options Fixture options to be set globally. If an option is provided per function call, options
   * provided via the parameter will override the global options.
   */
  static setGlobalOptions(options: FixtureOptions): void {
    Object.assign(MongooseFixture.globalOptions, options);
  }

  /**
   * Generates an array of mock data based on the schema.
   *
   * @inheritDoc
   * @override
   *
   * @typeParam T The type of the document corresponding to the Mongoose model or schema.
   *
   * @throws {Error} same as {@link MongooseFixture#generate}
   *
   * @public
   */
  override bulkGenerate(
    size: number,
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions,
  ): T[] {
    const combinedOptions = this.preGeneration(overrideValues, options);

    return Array.from({ length: size }, () =>
      this.recursivelyGenerateValue(
        this.schema as Schema,
        undefined,
        overrideValues,
        combinedOptions,
      ),
    );
  }

  /**
   * Generates a single mock data based on the schema.
   *
   * @inheritDoc
   * @override
   *
   * @typeParam T The type of the document corresponding to the Mongoose model or schema.
   *
   * @throws {Error}
   * For the following reasons:
   *
   * - If multiple override values are found for the same path. For example, { 'address.*.buildingNo': 42,
   * 'address.street.buildingNo': 43 }.
   * - If override value breaks the schema rule.
   * - If a required field is excluded.
   * - If a custom rule has conflict with the schema rule.
   * - If the value generated does not match the custom rule or the schema rule.
   *
   * @public
   */
  override generate(
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions,
  ): T {
    const combinedOptions = this.preGeneration(overrideValues, options);

    return this.recursivelyGenerateValue(
      this.schema as Schema,
      undefined,
      overrideValues,
      combinedOptions,
    );
  }

  /**
   * Recursively generates values for nested schema.
   * First, it iterates through each field in the schema and generates a value for each field.
   * If a field is a nested schema, it will recursively generate values for the nested schema.
   * During each iteration, it builds a sub path, e.g., 'address.street', 'address.street.city', etc.
   *
   * @example
   * const schema = new Schema({
   *   name: String,
   *   address: {
   *     street: String,
   *     city: String,
   *     country: {
   *      name: String,
   *      code: String,
   *     }
   *   },
   *   phone: String,
   * });
   *
   * For such a nested schema above, data will be generated for each child field in the schema.
   *
   * @param schemaNode The current level of the schema being processed.
   * @param rootPath The root path for the current schema node. If undefined, the current schema node is the root.
   * @param overrideValues Values to override in the schema.
   * @param options Fixture generation options.
   *
   * @returns The generated mock data for the current schema node.
   *
   * @private
   */
  private recursivelyGenerateValue(
    schemaNode: Schema<T>,
    rootPath: FieldPath | undefined,
    overrideValues: Record<FieldPath, Value> | undefined,
    options: FixtureOptions | undefined,
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
        options,
      );

      Object.assign(generated, { [path]: generatedValue });
    });

    return generated as T;
  }

  /**
   * Generates a value based on the schema type.
   *
   * We check if a field is nested by checking if it has a `schema` property.
   * If a field has basic types such as String, Number, etc., it will not have a schema property.
   * Whereas, if a field is an array or an embedded schema, it will have a schema property and will be recursively
   * processed.
   * Map types are also supported and processed in a special way, as they can be little more complex.
   *
   * @param path The path to the field.
   * @param schemaType The schema type of the field.
   * @param overrideValues Values to override in the schema.
   * @param options Fixture generation options.
   *
   * @returns A mock value for the field or `undefined` if the field is either excluded or explicitly set to
   * `undefined` in the override values.
   *
   * @private
   */
  private generateValueForSchemaType(
    path: FieldPath,
    schemaType: SchemaType,
    overrideValues: Record<FieldPath, Value> | undefined,
    options: FixtureOptions | undefined,
  ): Value | undefined {
    if (schemaType.instance === MongooseFixture.MAP_SCHEMA_INSTANCE) {
      return this.generateValueForMapType(
        path,
        schemaType,
        overrideValues,
        options,
      );
    }

    if (schemaType.schema) {
      return this.generateValueForNestedSchema(
        path,
        schemaType,
        overrideValues,
        options,
      );
    }

    return this.generateValue(path, schemaType, overrideValues, options);
  }

  /**
   * Generates a value for a nested schema.
   * Nested schema is a schema that either has an embedded schema or an array schema.
   * Values are generated recursively.
   *
   * @param path The path to the field.
   * @param schemaType The mongoose schema type of the field.
   * @param overrideValues Values to override in the schema.
   * @param options Fixture generation options.
   *
   * @returns A mock value for the field in the nested schema; `undefined` if the schema type is not a nested schema.
   *
   * @private
   */
  private generateValueForNestedSchema(
    path: FieldPath,
    schemaType: SchemaType,
    overrideValues: Record<FieldPath, Value> | undefined,
    options: FixtureOptions | undefined,
  ): Value | undefined {
    if (schemaType.instance === MongooseFixture.NESTED_SCHEMA_INSTANCE) {
      return this.recursivelyGenerateValue(
        schemaType.schema,
        path,
        overrideValues,
        options,
      ) as Value;
    }

    if (schemaType.instance === MongooseFixture.ARRAY_SCHEMA_INSTANCE) {
      return this.generateValueForSchemaArray(
        path,
        schemaType,
        overrideValues,
        options,
      );
    }

    return undefined;
  }

  /**
   * Generates a value for an array schema.
   * The process is similar to generating a value for a nested schema, except that it returns an array of values.
   * If a size is provided in the `rule`, the array will be generated with the specified size.
   *
   * @param path The path to the field.
   * @param schemaType The mongoose schema type of the field.
   * @param overrideValues Values to override in the schema.
   * @param options Fixture generation options.
   *
   * @returns An array of mock values
   *
   * @private
   */
  private generateValueForSchemaArray(
    path: FieldPath,
    schemaType: SchemaType,
    overrideValues: Record<FieldPath, Value> | undefined,
    options: FixtureOptions | undefined,
  ): Value[] {
    const rule = this.pathfinder.findRule(path, options?.rules);

    if (rule?.size) {
      return Array.from(
        { length: rule.size },
        () =>
          this.recursivelyGenerateValue(
            schemaType.schema,
            path,
            overrideValues,
            options,
          ) as Value,
      );
    }

    return [
      this.recursivelyGenerateValue(
        schemaType.schema,
        path,
        overrideValues,
        options,
      ) as Value,
    ];
  }

  /**
   * Generates a value for a map schema.
   * The types used in the map is separated into three main categories: array, schema and basic types.
   *
   * There are four special cases for processing a map:
   * 1. A map is of an array of schema -> { type: Map, of: [new Schema({ name: String, age: Number })] }
   * 2. A map is of an array of basic types -> { type: Map, of: [String] }
   * 3. A map is of a schema type -> { type: Map, of: new Schema({ name: String, age: Number }) }
   * 4. A map is of a basic type -> { type: Map, of: String }
   *
   * @param path The path to the field.
   * @param schemaType The mongoose schema type of the field.
   * @param overrideValues Values to override in the schema.
   * @param options Fixture generation options.
   *
   * @returns A key-value pair of mock values. Returns `undefined` if the map type is not defined.
   *
   * @private
   */
  private generateValueForMapType(
    path: FieldPath,
    schemaType: SchemaType,
    overrideValues: Record<FieldPath, Value> | undefined,
    options: FixtureOptions | undefined,
  ): Value | undefined {
    const { of: mapDefinition } = schemaType.options;

    if (!mapDefinition) {
      return undefined;
    }

    // Generate a mock vale for the map key
    const mapKey = this.generateMapKey();

    let value: Value | Value[] | undefined;

    if (Array.isArray(mapDefinition)) {
      // 1. processing of array types -> { type: Map, of: [String] } or { type: Map, of: [Schema] }
      value = this.generateArrayMapValues(
        mapDefinition[0],
        path,
        overrideValues,
        options,
      );
    } else if (mapDefinition instanceof Schema) {
      // 2. processing of schema type, which is just a nested schema generation
      value = this.recursivelyGenerateValue(
        mapDefinition,
        path,
        overrideValues,
        options,
      ) as Value;
    } else {
      // 3. processing of basic map types -> { type: Map, of: String }
      value = this.generateBasicMapValue(mapDefinition.name);
    }

    return { [mapKey]: value };
  }

  /**
   * Generates a value for an array map type.
   *
   * @example
   * {
   *  basicArray: [1, 2, 3],
   *  schemaArray: [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }],
   * }
   *
   * @param mapDefinition Either based on schema or basic type. If based on basic type, we access the `name` property.
   * @param path The path to the field.
   * @param overrideValues Values to override in the schema.
   * @param options Fixture generation options.
   *
   * @returns An array of mock values, either an object of values or primitive values.
   *
   * @private
   */
  private generateArrayMapValues(
    mapDefinition: Schema | { name: string },
    path: FieldPath,
    overrideValues: Record<FieldPath, Value> | undefined,
    options: FixtureOptions | undefined,
  ): Value[] {
    const rule = this.pathfinder.findRule(path, options?.rules);
    const size = rule?.size ?? 1; // Default to 1 if size is not specified
    const isSchema = mapDefinition instanceof Schema;

    return Array.from({ length: size }, () => {
      if (isSchema) {
        return this.recursivelyGenerateValue(
          mapDefinition as Schema,
          path,
          overrideValues,
          options,
        ) as Value;
      }

      return this.generateBasicMapValue(mapDefinition.name);
    });
  }

  /**
   * Generates a map value based on the basic type -> { type: Map, of: String }
   *
   * @param basicFieldType The basic type of the map value. String, Number, etc.
   *
   * @returns A mock value for the map value.
   *
   * @private
   */
  private generateBasicMapValue(basicFieldType: string): Value {
    const fieldType = this.typeMapper.getType(
      basicFieldType,
    ) as NonArrayFieldType;

    // The field name is irrelevant here, as it will return a random value regardless.
    return this.generateSingleValue('value', fieldType, undefined, false);
  }

  /**
   * Generates a random map value which will be used for the map key.
   *
   * @returns A random map key.
   *
   * @private
   */
  private generateMapKey(): string {
    return this.generateSingleValue(
      'mapKey', // The field name is irrelevant here, as it will return a random value regardless.
      FieldType.STRING,
      undefined,
      false,
    ) as string;
  }

  /**
   * Generates a value for a field based on the schema type.
   * If a value is provided in the `overrideValues`, it will be used instead of generating a new value.
   * If a `rule` is provided, a value will be generated based on it.
   *
   * @param path The path to the field.
   * @param schemaType The mongoose schema type of the field.
   * @param overrideValues Values to override in the schema.
   * @param options Fixture generation options.
   *
   * @returns A mock value for the field or a value in the `overrideValues` if it exists.
   *
   * @throws {Error} If the value generated does not match the custom rule or the schema rule.
   *
   * @private
   */
  private generateValue(
    path: FieldPath,
    schemaType: SchemaType,
    overrideValues: Record<FieldPath, Value> | undefined,
    options: FixtureOptions | undefined,
  ): Value | undefined {
    const rule = this.pathfinder.findRule(path, options?.rules);

    const value = this.shouldOverride(path, overrideValues)
      ? this.overrideValue(path, overrideValues)
      : this.generateMockValue(path, schemaType, rule, options?.isAccurate);

    this.mongooseValidator.validateValue(schemaType, value, rule);

    return value;
  }

  /**
   * Generates a mock value for a field based on the schema rule and the custom rule.
   *
   * @param path The path to the field.
   * @param schemaType The mongoose schema type of the field.
   * @param rule The custom rule to apply for the field.
   * @param isAccurate If set to `true`, the value will be generated based on the field name. {@link FakerFinder#search}
   *
   * @returns A mock value for the field or `undefined`.
   *
   * @throws {Error} If the schema rules and custom rules conflict each other
   *
   * @private
   */
  private generateMockValue(
    path: FieldPath,
    schemaType: SchemaType,
    rule: Rule | undefined,
    isAccurate = true,
  ): Value | undefined {
    const type = this.typeMapper.getType(schemaType.instance);

    const schemaRule = this.mongooseValidator.parseValidators(
      schemaType.validators,
    );

    if (schemaRule && rule) {
      this.mongooseValidator.validateRules(schemaRule, rule);
    }

    const combinedRule = this.mongooseValidator.combineRules(schemaRule, rule);
    const fieldName = this.pathfinder.extractFieldName(path);

    if (type === FieldType.ARRAY) {
      // caster is the schema type of the array elements, from which we can get the array type, e.g., String, Number, etc.
      const { caster } = schemaType as Schema.Types.Array;

      return caster?.instance
        ? this.generateArrayValue(
            fieldName,
            this.typeMapper.getArrayType(caster.instance),
            combinedRule?.size,
            /**
             * The parsed rule here is the rule for the array elements.
             * @example
             * const schema = new Schema({ values: [type: String, enum: ['A', 'B', 'C']] });
             */
            this.mongooseValidator.parseValidators(caster.validators),
            isAccurate,
          )
        : undefined;
    }

    return this.generateSingleValue(fieldName, type, combinedRule, isAccurate);
  }

  /**
   * Pre-generation routine to validate and extract paths and to set global options.
   *
   * @param overrideValues Values to override in the schema.in the schema
   * @param options Fixture generation options.
   *
   * @returns Merged fixture options.
   *
   * @throws {Error} If paths defined both in the `overrideValues` and the `options` are invalid.
   *
   * @private
   */
  private preGeneration(
    overrideValues: Record<FieldPath, Value> | undefined,
    options: FixtureOptions | undefined,
  ): FixtureOptions {
    const extractedPaths = this.extractPaths(overrideValues, options);
    this.pathfinder.validatePaths(extractedPaths);

    if (!options) {
      return MongooseFixture.globalOptions;
    }

    return Object.assign({}, MongooseFixture.globalOptions, options);
  }

  /**
   * Checks if a given field (path) is excluded from the fixture generation.
   *
   * @param path The path to the field.
   * @param schemaType The mongoose schema type of the field.
   * @param options Fixture generation options.
   *
   * @returns `true` if the field is excluded, `false` otherwise.
   *
   * @throws {Error} If a required field is excluded.
   *
   * @private
   */
  private isExcluded(
    path: FieldPath,
    schemaType: SchemaType,
    options: FixtureOptions | undefined,
  ): boolean {
    // Immediately return true if only required fields are needed and the current field is not required.
    // Also, return true if the current field is the version key (__v) or contains special characters (.$*).
    if (
      path === MongooseFixture.VERSION_KEY ||
      this.containsSpecialChars(path) ||
      (options?.requiredOnly && !schemaType.isRequired)
    ) {
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

  /**
   * Checks if the path contains special characters.
   *
   * @param path The path to the field.
   *
   * @returns `true` if the path contains special characters, `false` otherwise.
   *
   * @private
   */
  private containsSpecialChars(path: FieldPath) {
    return MongooseFixture.MONGOOSE_SPECIAL_CHARS_REGEX.test(path);
  }

  /**
   * Checks if the target is a Mongoose model.
   * Model instances have a `schema` property, by which we can distinguish between a model and a schema.
   *
   * @param target Either a Mongoose model or a schema.
   *
   * @returns `true` if the target is a Mongoose model, `false` otherwise.
   *
   * @private
   */
  private isModel(target: Model<T> | Schema<T>): target is Model<T> {
    return (target as Model<T>).schema !== undefined;
  }
}
