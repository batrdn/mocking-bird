import { Model, Schema, SchemaType } from 'mongoose';
import {
  CoreFixture,
  FieldPath,
  FixtureOptions,
  PathFinder,
  Rule,
  Validator,
  Value,
} from '@mocking-bird/core';
import { MongooseTypeMapper } from './mongoose-type-mapper';

export class MongooseFixture<
  T extends Record<string, any>
> extends CoreFixture<T> {
  private readonly schema: Schema<T>;

  private static readonly ROOT_PATH = 'root';

  private pathfinder: PathFinder;
  private validator: Validator;
  private mongooseTypeMapper: MongooseTypeMapper;

  /**
   * @param model - The Mongoose model or schema to generate fixtures for.
   * If a model is provided, the schema will be extracted from it, e.g., a model created with
   * `mongoose.model('ModelName', schema)`.
   *
   * If a schema is provided, it will be used directly.
   */
  constructor(model: Model<T> | Schema<T>) {
    super();
    this.schema = this.isModel(model) ? model.schema : model;

    this.pathfinder = new PathFinder();
    this.validator = new Validator();
    this.mongooseTypeMapper = new MongooseTypeMapper();
  }

  /**
   * Generates a fixture for the given schema.
   *
   * @param overrideValues
   * @param options
   */
  generate(
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions
  ): T {
    return this.recursivelyGenerateValue(
      MongooseFixture.ROOT_PATH,
      this.schema as Schema,
      overrideValues,
      options
    );
  }

  /**
   *
   * @param rootPath
   * @param schemaNode
   * @param overrideValues
   * @param options
   * @private
   */
  private recursivelyGenerateValue(
    rootPath: string,
    schemaNode: Schema<T>,
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions
  ): T {
    const generated = {};

    schemaNode.eachPath((path, schemaType) => {
      let generatedValue;
      const subPath = `${rootPath}.${path}`;

      if (schemaType.schema) {
        generatedValue = this.recursivelyGenerateValue(
          subPath,
          schemaType.schema,
          overrideValues,
          options
        );
      } else {
        const isExcluded = this.isExcluded(subPath, schemaType, options);

        generatedValue = isExcluded
          ? undefined
          : this.generateValue(
              subPath,
              schemaType,
              overrideValues,
              options?.rules
            );
      }

      Object.assign(generated, { [path]: generatedValue });
    });

    return generated as T;
  }

  private generateValue(
    path: string,
    schemaType: SchemaType,
    overrideValues?: Record<FieldPath, Value>,
    rules?: Rule[]
  ): Value | undefined {
    const value = this.shouldOverride(path, overrideValues)
      ? this.overrideValue(path, overrideValues)
      : this.generateMockValue(path, schemaType, rules);

    this.validateValue(path, value, schemaType, rules);

    return value;
  }

  private generateMockValue(
    path: string,
    schemaType: SchemaType,
    rules?: Rule[]
  ): Value | undefined {
    const type = this.mongooseTypeMapper.getType(schemaType.instance);

    if (!type) {
      console.warn(`Unsupported type: ${schemaType.instance}`);
      return undefined;
    }

    return super.generateSingleValue(path, type, rules);
  }

  private overrideValue(
    path: string,
    overrideValues: Record<FieldPath, Value> | undefined
  ): Value | undefined {
    if (!overrideValues) {
      return undefined;
    }

    const key = this.pathfinder.find(path, Object.keys(overrideValues));

    return key && overrideValues.hasOwnProperty(key)
      ? overrideValues[key]
      : undefined;
  }

  private validateValue(
    path: string,
    value: Value | undefined,
    schemaType: SchemaType,
    rules?: Rule[]
  ) {
    this.validateAgainstSchema(path, value, schemaType);

    if (rules?.length) {
      this.validateAgainstCustomRules(path, value, rules);
    }
  }

  /**
   *
   * @param path
   * @param value
   * @param schemaType
   * @private
   */
  private validateAgainstSchema(
    path: string,
    value: Value | undefined,
    schemaType: SchemaType
  ) {
    if (value === undefined && schemaType.isRequired) {
      throw new Error(`Required field '${path}' is undefined`);
    }

    schemaType.validators.forEach((validator) => {
      if (!validator?.validator?.(value)) {
        throw new Error(
          `Invalid value for field '${path}': ${JSON.stringify(value)}`
        );
      }
    });
  }

  /**
   *
   * @param path
   * @param value
   * @param rules
   * @private
   */
  private validateAgainstCustomRules(
    path: string,
    value: Value | undefined,
    rules: Rule[]
  ) {
    const rulePaths = rules.map(({ path }) => path);

    if (!this.pathfinder.exists(path, rulePaths)) {
      return;
    }

    const key = this.pathfinder.find(path, rulePaths);

    rules.forEach((rule) => {
      if (rule.path !== key) {
        return;
      }

      this.validator.validate(value, rule);
    });
  }

  private isExcluded(
    path: string,
    schemaType: SchemaType,
    options?: FixtureOptions
  ): boolean {
    // Immediately return true if only required fields are needed and the current field is not required
    if (options?.requiredOnly && !schemaType.isRequired) {
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
    path: string,
    overrideValues: Record<FieldPath, Value> | undefined
  ): boolean {
    return (
      !!overrideValues &&
      this.pathfinder.exists(path, Object.keys(overrideValues))
    );
  }

  private isModel(model: Model<T> | Schema<T>): model is Model<T> {
    return (model as Model<T>).schema !== undefined;
  }
}
