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

export class MongooseFixture<
  T extends Record<string, any>
> extends AbstractFixture<T> {
  private readonly schema: Schema<T>;

  private static readonly ROOT_PATH = 'root';

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

    super(pathfinder, mongooseTypeMapper);

    this.schema = this.isModel(model) ? model.schema : model;
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
    const rule = this.findRule(path, rules);

    const value = this.shouldOverride(path, overrideValues)
      ? this.overrideValue(path, overrideValues)
      : this.generateMockValue(path, schemaType, rule);

    // TODO: PROBABLY need to cast some types like ObjectId, BigInt etc...

    this.validateValue(path, value, schemaType, rule);

    return value;
  }

  private generateMockValue(
    path: string,
    schemaType: SchemaType,
    rule?: Rule
  ): Value | undefined {
    const type = this.typeMapper.getType(schemaType.instance);

    if (type === FieldType.ARRAY) {
      // TODO: handle array type
    }

    // TODO: compare schema rule with custom rule
    // TODO: create rule from schema

    return this.generateSingleValue(path, type, rule);
  }

  private overrideValue(
    path: string,
    overrideValues: Record<FieldPath, Value> | undefined
  ): Value | undefined {
    if (!overrideValues) {
      return undefined;
    }

    const overrideValuePaths = Object.keys(overrideValues);

    const matchingPaths = this.pathfinder.find(path, overrideValuePaths);

    if (matchingPaths.length > 1) {
      throw new Error(
        `Forbidden: multiple override values found for path '${path}': ${matchingPaths.join(
          ', '
        )}`
      );
    }

    const overrideKey = matchingPaths[0];

    return overrideValues.hasOwnProperty(overrideKey)
      ? overrideValues[overrideKey]
      : undefined;
  }

  private validateValue(
    path: string,
    value: Value | undefined,
    schemaType: SchemaType,
    rule?: Rule
  ) {
    this.validateAgainstSchema(path, value, schemaType);

    if (rule) {
      super.validator.validate(value, rule);
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
          `Validation failed for field '${path}': ${JSON.stringify(value)}`
        );
      }
    });
  }

  private findRule(path: string, rules: Rule[] | undefined): Rule | undefined {
    if (!rules) {
      return undefined;
    }

    const rulePaths = rules.map(({ path }) => path);

    if (!this.pathfinder.exists(path, rulePaths)) {
      return;
    }

    const matchingPaths = this.pathfinder.find(path, rulePaths);

    if (matchingPaths.length > 1) {
      throw new Error(
        `Forbidden: multiple rules found for path '${path}': ${matchingPaths.join(
          ', '
        )}`
      );
    }

    const matchingPath = matchingPaths[0];

    return rules.find((rule) => rule.path === matchingPath);
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
