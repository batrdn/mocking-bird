import { GraphQLSchema } from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
  CoreFixture,
  FieldPath,
  FieldType,
  GlobPathFinder,
  NonArrayFieldType,
  Rule,
  Value,
} from '@mocking-bird/core';
import { GraphQLTypeMapper } from './graphql-type-mapper';
import {
  GraphQLFixtureOptions,
  GraphQLFixtureResult,
  TransformedDocumentNode,
} from './type';
import { DocumentNodeTransformer } from './document-node-transformer';
import { TreeHelper } from './tree-helpers';

/**
 * ### Overview
 *
 * GraphQLFixture is a concrete class that extends CoreFixture and is responsible for generating mock data for
 * GraphQL queries and mutations.
 *
 * @typeParam TVariables The variables that are passed to the query or mutation.
 * @typeParam TData The data that is returned by the query or mutation, i.e., the body of the response.
 *
 * @example
 * const fixture = new GraphQLFixture(schema, GetQueryDocument);
 * const result = fixture.generate();
 */
export class GraphQLFixture<TData, TVariables> extends CoreFixture<
  GraphQLFixtureResult<TData, TVariables>
> {
  private static readonly globalOptions: GraphQLFixtureOptions = {};
  private static globalSchema: GraphQLSchema;

  private readonly transformer: DocumentNodeTransformer<TData, TVariables>;

  constructor(documentNode: TypedDocumentNode<TData, TVariables>);

  constructor(
    documentNode: TypedDocumentNode<TData, TVariables>,
    schema?: GraphQLSchema,
  ) {
    const pathfinder = new GlobPathFinder();
    const typeMapper = new GraphQLTypeMapper();

    super(pathfinder, typeMapper);

    this.transformer = new DocumentNodeTransformer(
      schema ?? GraphQLFixture.globalSchema,
      documentNode,
    );
  }

  static setGlobalOptions(options: GraphQLFixtureOptions): void {
    Object.assign(GraphQLFixture.globalOptions, options);
  }

  static registerSchema(schema: GraphQLSchema): void {
    GraphQLFixture.globalSchema = schema;
  }

  /**
   * Generates an array of mock data based on the provided document node.
   *
   * @inheritDoc
   *
   * @typeParam TData The data that is returned by the query or mutation, i.e., the body of the response.
   * @typeParam TVariables The variables that are passed to the query or mutation.
   *
   * @public
   */
  override bulkGenerate(
    size: number,
    overrideValues?: Record<FieldPath, Value> | undefined,
    options?: GraphQLFixtureOptions | undefined,
  ): GraphQLFixtureResult<TData, TVariables>[] {
    const combinedOptions = this.preGeneration(overrideValues, options);

    return Array.from({ length: size }, () =>
      this.generateMock(overrideValues, combinedOptions),
    );
  }

  /**
   * Generates mock data based on the provided document node.
   *
   * @inheritDoc
   *
   * @typeParam TData The data that is returned by the query or mutation, i.e., the body of the response.
   * @typeParam TVariables The variables that are passed to the query or mutation.
   *
   * @public
   *
   */
  override generate(
    overrideValues?: Record<FieldPath, Value> | undefined,
    options?: GraphQLFixtureOptions | undefined,
  ): GraphQLFixtureResult<TData, TVariables> {
    const combinedOptions = this.preGeneration(overrideValues, options);

    return this.generateMock(overrideValues, combinedOptions);
  }

  /**
   * Generates a mock data for both query/mutation variables and response data.
   *
   * @param overrideValues The values to override the generated mock data.
   * @param options The options to customize the generation of mock data.
   *
   * @returns The generated mock data for both query/mutation variables and response data.
   *
   * @private
   */
  private generateMock(
    overrideValues: Record<FieldPath, Value> | undefined,
    options: GraphQLFixtureOptions | undefined,
  ): GraphQLFixtureResult<TData, TVariables> {
    const transformedDocumentNodes = this.transformer.getTransformedDataNodes();
    const transformedVariableNodes =
      this.transformer.getTransformedVariableNodes();

    const variables = this.recursivelyGenerateValue<TVariables>(
      transformedVariableNodes,
      undefined,
      overrideValues,
      options,
    );

    const data = this.recursivelyGenerateValue<TData>(
      transformedDocumentNodes,
      undefined,
      overrideValues,
      options,
      TreeHelper.denormalize({ variables }),
    );

    return {
      variables,
      data,
    };
  }

  /**
   * Recursively generates a value for a given document node.
   *
   * @param transformedDocumentNodes An array of transformed document nodes.
   * @param rootPath The root path of the document node. If undefined, it's considered to be the root.
   * @param overrideValues The values to override the generated mock data.
   * @param options The options to customize the generation of mock data.
   * @param generatedValues The stored generated values, from which field relations are resolved.
   *
   * @typeParam T The type of the generated value, which is either TVariables or TData.
   *
   * @return The generated value for the document node.
   *
   * @private
   */
  private recursivelyGenerateValue<T>(
    transformedDocumentNodes: TransformedDocumentNode[],
    rootPath: FieldPath | undefined,
    overrideValues: Record<FieldPath, Value> | undefined,
    options: GraphQLFixtureOptions | undefined,
    generatedValues: Record<FieldPath, Value> = {},
  ): T {
    const generated = {};

    transformedDocumentNodes.forEach((node) => {
      const subPath = rootPath
        ? this.pathfinder.createPath(rootPath, node.fieldName)
        : node.fieldName;

      if (this.isExcluded(node, subPath, options)) {
        return;
      }

      const relatedPath = this.findFieldRelations(
        subPath,
        options?.fieldRelations,
      );

      // If the related path is found in the field relations, the generated value is taken from the generated values.
      if (relatedPath && generatedValues[relatedPath] !== undefined) {
        Object.assign(generated, {
          [node.fieldName]: generatedValues[relatedPath],
        });
        return;
      }

      const generatedValue = this.generateValueForDocumentNode(
        node,
        subPath,
        overrideValues,
        options,
        generatedValues,
      );

      Object.assign(generatedValues, { [subPath]: generatedValue });

      // If addTypeName is set to true, add the __typename field to the generated value.
      if (options?.addTypeName && !node.isScalar) {
        Object.assign(generated, { __typename: node.fieldType });
      }

      Object.assign(generated, { [node.fieldName]: generatedValue });
    });

    return generated as T;
  }

  /**
   * Generates a value for a given document node.
   *
   * @param node The transformed document node.
   * @param path The path of the document node.
   * @param overrideValues The values to override the generated mock data.
   * @param options The options to customize the generation of mock data.
   * @param generatedValues The stored generated values, from which field relations are resolved.
   *
   * @returns The generated value for the document node.
   *
   * @private
   */
  private generateValueForDocumentNode(
    node: TransformedDocumentNode,
    path: FieldPath,
    overrideValues: Record<FieldPath, Value> | undefined,
    options: GraphQLFixtureOptions | undefined,
    generatedValues: Record<FieldPath, Value>,
  ): Value | undefined {
    if (node.children?.length) {
      return this.generateValueForNestedDocumentNode(
        node,
        path,
        overrideValues,
        options,
        generatedValues,
      );
    }

    return this.generateValue(node, path, overrideValues, options);
  }

  /**
   * Generates a value for a nested document node.
   *
   * @param node The transformed document node.
   * @param path The path of the document node.
   * @param overrideValues The values to override the generated mock data.
   * @param options The options to customize the generation of mock data.
   * @param generatedValues The stored generated values, from which field relations are resolved.
   *
   * @returns The generated value for the nested document node.
   *
   * @private
   */
  private generateValueForNestedDocumentNode(
    node: TransformedDocumentNode,
    path: FieldPath,
    overrideValues: Record<FieldPath, Value> | undefined,
    options: GraphQLFixtureOptions | undefined,
    generatedValues: Record<FieldPath, Value>,
  ): Value | undefined {
    if (node.isArray) {
      return this.generateValueForArrayDocumentNode(
        node,
        path,
        overrideValues,
        options,
        generatedValues,
      );
    }

    return this.recursivelyGenerateValue(
      node.children!,
      path,
      overrideValues,
      options,
      generatedValues,
    );
  }

  /**
   * Generates a value for a document node, which is of an array type.
   *
   * @param node The transformed document node.
   * @param path The path of the document node.
   * @param overrideValues The values to override the generated mock data.
   * @param options The options to customize the generation of mock data.
   * @param generatedValues The stored generated values, from which field relations are resolved.
   *
   * @returns An array of generated values for the document node.
   *
   * @private
   */
  private generateValueForArrayDocumentNode(
    node: TransformedDocumentNode,
    path: FieldPath,
    overrideValues: Record<FieldPath, Value> | undefined,
    options: GraphQLFixtureOptions | undefined,
    generatedValues: Record<FieldPath, Value>,
  ): Value[] | undefined {
    const rule = this.pathfinder.findRule(path, options?.rules);

    if (rule?.size) {
      return Array.from({ length: rule.size }, () =>
        this.recursivelyGenerateValue(
          node.children!,
          path,
          overrideValues,
          options,
          generatedValues,
        ),
      );
    }

    return [
      this.recursivelyGenerateValue(
        node.children!,
        path,
        overrideValues,
        options,
        generatedValues,
      ),
    ];
  }

  /**
   * A function that abstracts the generation of a single value.
   * If override values are found, returns the overridden value.
   *
   * @param node The transformed document node.
   * @param path The path of the document node.
   * @param overrideValues The values to override the generated mock data.
   * @param options The options to customize the generation of mock data.
   *
   * @returns The generated/overridden value for the document node.
   *
   * @private
   */
  private generateValue(
    node: TransformedDocumentNode,
    path: FieldPath,
    overrideValues: Record<FieldPath, Value> | undefined,
    options: GraphQLFixtureOptions | undefined,
  ): Value | undefined {
    const rule = this.pathfinder.findRule(path, options?.rules);

    return this.shouldOverride(path, overrideValues)
      ? this.overrideValue(path, overrideValues)
      : this.generateMockValue(node, path, rule, options);
  }

  /**
   * Generates a single value for a document node.
   *
   * @param node The transformed document node.
   * @param path The path of the document node.
   * @param rule The rule and constraint to be used for the document node.
   * @param options The options to customize the generation of mock data.
   *
   * @returns The generated value for the document node.
   *
   * @private
   */
  private generateMockValue(
    node: TransformedDocumentNode,
    path: FieldPath,
    rule: Rule | undefined,
    options: GraphQLFixtureOptions | undefined,
  ): Value | undefined {
    // GraphQL enums are treated as strings. The enum values are inserted as rule in combineRules.
    const type = node.isEnum
      ? FieldType.STRING
      : this.typeMapper.getType(node.fieldType);

    const combinedRule = this.combineRules(node, path, rule);

    if (node.isArray) {
      return this.generateArrayValue(
        node.fieldName,
        type as NonArrayFieldType,
        combinedRule?.size,
        combinedRule,
        options?.isAccurate,
      );
    }

    // If the field is a custom scalar, the scalar definition is used to generate the value.
    if (node.isCustomScalar && options?.scalarDefinitions?.[node.fieldType]) {
      const { defaultValue, type } = options.scalarDefinitions[node.fieldType];

      const generatedValue = this.generateSingleValue(
        node.fieldName,
        type,
        combinedRule,
        options?.isAccurate,
      );

      return generatedValue ?? defaultValue;
    }

    return this.generateSingleValue(
      node.fieldName,
      type as NonArrayFieldType,
      combinedRule,
      options?.isAccurate,
    );
  }

  /**
   * Finds field relations, if any, for a given path.
   *
   * @param currentPath The current path to find the field relations for.
   * @param fieldRelations The field relations to search for the current path.
   *
   * @returns The related path, if found.
   *
   * @private
   */
  private findFieldRelations(
    currentPath: FieldPath,
    fieldRelations?:
      | Record<FieldPath, FieldPath>
      | Record<FieldPath, FieldPath[]>,
  ): FieldPath | undefined {
    if (!fieldRelations) {
      return undefined;
    }

    let relatedPath: FieldPath | undefined;

    // the `data` prefix is used as a root path for the field relations.
    const pathToFind = `data.${currentPath}`;

    Object.entries(fieldRelations).forEach(([sourcePath, targetPath]) => {
      if (Array.isArray(targetPath)) {
        targetPath.forEach((path) => {
          if (path === pathToFind) {
            relatedPath = sourcePath;
          }
        });

        return;
      }

      if (targetPath === pathToFind) {
        relatedPath = sourcePath;
      }
    });

    return relatedPath;
  }

  /**
   * Combines the custom rule and certain properties in the transformed document node.
   *
   * @param node The transformed document node.
   * @param path The path of the document node.
   * @param rule The custom rule to be combined with the properties of the document node.
   *
   * @returns The combined rule.
   *
   * @private
   */
  private combineRules(
    node: TransformedDocumentNode,
    path: FieldPath,
    rule: Rule | undefined,
  ): Rule {
    const combinedRule: Rule = {
      path,
    };

    if (node.isRequired) {
      Object.assign(combinedRule, { required: true });
    }

    if (node.isEnum) {
      Object.assign(combinedRule, { enum: rule?.enum ?? node.enumValues });
    }

    return Object.assign({}, rule, combinedRule);
  }

  /**
   * Checks if a value should be excluded for generation
   *
   * @param node The transformed document node.
   * @param path The path of the document node.
   * @param options The options to customize the generation of mock data.
   *
   * @returns True if the value should be excluded, false otherwise.
   *
   * @private
   */
  private isExcluded(
    node: TransformedDocumentNode,
    path: FieldPath,
    options: GraphQLFixtureOptions | undefined,
  ): boolean {
    if (
      (options?.requiredOnly && !node.isRequired) ||
      (node.isCustomScalar && options?.ignoreCustomScalars)
    ) {
      return true;
    }

    if (!options?.exclude?.length) {
      return false;
    }

    const excluded = this.pathfinder.exists(path, options.exclude);

    if (excluded && node.isRequired) {
      throw new Error(`Cannot exclude required field: ${path}`);
    }

    return excluded;
  }

  /**
   * The preparation step for generating mock data by:
   *
   * - Validates the paths extracted from the override values and options.
   * - Merges the global options with the provided options.
   *
   * @param overrideValues The values to override the generated mock data.
   * @param options The options to customize the generation of mock data.
   *
   * @returns The combined options.
   *
   * @private
   */
  private preGeneration(
    overrideValues: Record<FieldPath, Value> | undefined,
    options: GraphQLFixtureOptions | undefined,
  ): GraphQLFixtureOptions {
    const extractedPaths = this.extractPaths(overrideValues, options);
    this.pathfinder.validatePaths(extractedPaths);

    if (!options) {
      return GraphQLFixture.globalOptions;
    }

    return Object.assign({}, GraphQLFixture.globalOptions, options);
  }
}
