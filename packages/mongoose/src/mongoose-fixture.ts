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
    this.validatePaths(overrideValues, options);

    return this.recursivelyGenerateValue(
      this.schema as Schema,
      undefined,
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
    schemaNode: Schema<T>,
    rootPath: FieldPath | undefined,
    overrideValues?: Record<FieldPath, Value>,
    options?: FixtureOptions
  ): T {
    const generated = {};

    schemaNode.eachPath((path, schemaType) => {
      let generatedValue;
      const subPath = rootPath
        ? this.pathfinder.createPath(rootPath, path)
        : path;

      if (schemaType.schema && schemaType.instance === 'Embedded') {
        generatedValue = this.recursivelyGenerateValue(
          schemaType.schema,
          subPath,
          overrideValues,
          options
        );
      } else if (schemaType.schema && schemaType.instance === 'Array') {
        const rule = this.findRule(subPath, options?.rules);

        if (rule?.size) {
          generatedValue = Array.from({ length: rule.size }, () =>
            this.recursivelyGenerateValue(
              schemaType.schema,
              subPath,
              overrideValues,
              options
            )
          );
        } else {
          generatedValue = [
            this.recursivelyGenerateValue(
              schemaType.schema,
              subPath,
              overrideValues,
              options
            ),
          ];
        }
      } else {
        const isExcluded = this.isExcluded(subPath, schemaType, options);

        if (isExcluded) {
          return;
        }

        generatedValue = this.generateValue(
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
    path: FieldPath,
    schemaType: SchemaType,
    overrideValues?: Record<FieldPath, Value>,
    rules?: Rule[]
  ): Value | undefined {
    const rule = this.findRule(path, rules);

    const value = this.shouldOverride(path, overrideValues)
      ? this.overrideValue(path, overrideValues)
      : this.generateMockValue(path, schemaType, rule);

    this.mongooseValidator.validateValue(path, value, schemaType, rule);

    return value;
  }

  private generateMockValue(
    path: FieldPath,
    schemaType: SchemaType,
    rule?: Rule
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
            combinedRule
          )
        : undefined;
    }

    return this.generateSingleValue(path, type, combinedRule);
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

  private findRule(
    path: FieldPath,
    rules: Rule[] | undefined
  ): Rule | undefined {
    if (!rules) {
      return undefined;
    }

    const rulePaths = rules.map(({ path }) => path);
    const matchingPatterns = this.pathfinder.findPatterns(path, rulePaths);

    if (matchingPatterns.length === 0) {
      return undefined;
    }

    if (matchingPatterns.length > 1) {
      throw new Error(
        `Forbidden: multiple rules found for path '${path}': ${matchingPatterns.join(
          ', '
        )}`
      );
    }

    const pattern = matchingPatterns[0];

    return rules.find((rule) => rule.path === pattern);
  }

  private isExcluded(
    path: FieldPath,
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
    path: FieldPath,
    overrideValues: Record<FieldPath, Value> | undefined
  ): boolean {
    return (
      !!overrideValues &&
      this.pathfinder.exists(path, Object.keys(overrideValues))
    );
  }

  private validatePaths(
    overrideValues: Record<FieldPath, Value> | undefined,
    options: FixtureOptions | undefined
  ) {
    const paths = [];

    if (overrideValues) {
      paths.push(...Object.keys(overrideValues));
    }

    if (options?.exclude?.length) {
      paths.push(...options.exclude);
    }

    if (options?.rules?.length) {
      paths.push(...options.rules.map(({ path }) => path));
    }

    this.pathfinder.validatePaths(paths);
  }

  private isModel(model: Model<T> | Schema<T>): model is Model<T> {
    return (model as Model<T>).schema !== undefined;
  }
}
