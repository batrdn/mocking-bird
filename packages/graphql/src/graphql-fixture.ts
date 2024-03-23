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

export class GraphQLFixture<TData, TVariables> extends CoreFixture<
  GraphQLFixtureResult<TData, TVariables>
> {
  private static readonly globalOptions: GraphQLFixtureOptions = {};

  private readonly transformer: DocumentNodeTransformer<TData, TVariables>;

  constructor(
    schema: GraphQLSchema,
    documentNode: TypedDocumentNode<TData, TVariables>,
  ) {
    const pathfinder = new GlobPathFinder();
    const typeMapper = new GraphQLTypeMapper();

    super(pathfinder, typeMapper);

    this.transformer = new DocumentNodeTransformer(schema, documentNode);
  }

  static setGlobalOptions(options: GraphQLFixtureOptions): void {
    Object.assign(GraphQLFixture.globalOptions, options);
  }

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

  override generate(
    overrideValues?: Record<FieldPath, Value> | undefined,
    options?: GraphQLFixtureOptions | undefined,
  ): GraphQLFixtureResult<TData, TVariables> {
    const combinedOptions = this.preGeneration(overrideValues, options);

    return this.generateMock(overrideValues, combinedOptions);
  }

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

  private recursivelyGenerateValue<T>(
    transformedDocumentNode: TransformedDocumentNode[],
    rootPath: FieldPath | undefined,
    overrideValues: Record<FieldPath, Value> | undefined,
    options: GraphQLFixtureOptions | undefined,
    generatedValues: Record<FieldPath, Value> = {},
  ): T {
    const generated = {};

    transformedDocumentNode.forEach((node) => {
      const subPath = rootPath
        ? this.pathfinder.createPath(rootPath, node.fieldName)
        : node.fieldName;

      if (this.isExcluded(node, subPath, options)) {
        return;
      }

      const relatedPath = this.findRelatedPath(
        subPath,
        options?.fieldRelations,
      );

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

      if (options?.addTypeName && !node.isScalar) {
        Object.assign(generated, { __typename: node.fieldType });
      }

      Object.assign(generated, { [node.fieldName]: generatedValue });
    });

    return generated as T;
  }

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

  private generateValueForArrayDocumentNode(
    node: TransformedDocumentNode,
    path: FieldPath,
    overrideValues: Record<FieldPath, Value> | undefined,
    options: GraphQLFixtureOptions | undefined,
    generatedValues: Record<FieldPath, Value>,
  ): Value | undefined {
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

  private generateMockValue(
    node: TransformedDocumentNode,
    path: FieldPath,
    rule: Rule | undefined,
    options: GraphQLFixtureOptions | undefined,
  ): Value | undefined {
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

  private findRelatedPath(
    currentPath: FieldPath,
    fieldRelations?:
      | Record<FieldPath, FieldPath>
      | Record<FieldPath, FieldPath[]>,
  ): FieldPath | undefined {
    if (!fieldRelations) {
      return undefined;
    }

    let relatedPath: FieldPath | undefined;

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
