import {
  BREAK,
  FieldNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  GraphQLInputType,
  GraphQLNamedInputType,
  GraphQLOutputType,
  GraphQLSchema,
  isInputObjectType,
  VariableNode,
  visit,
} from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { TypeInfo, visitWithTypeInfo } from 'graphql/utilities';
import {
  getNamedType,
  isListType,
  isNonNullType,
  isScalarType,
  GraphQLEnumType,
  isEnumType,
  GraphQLNamedType,
} from 'graphql/type';
import { TransformedDocumentNode } from './type';
import { GraphQLTypeMapper } from './graphql-type-mapper';

/**
 * ### Overview
 *
 * DocumentNodeTransformer transforms GraphQL TypedDocumentNode into a simplified structure that can be used to
 * generate mock data. The information, such as, whether a field is an array or an enum or a scalar, is extracted
 * from the GraphQL schema. By traversing the document node via graphql utilities such as visit and
 * visitWithTypeInfo functions, the transformer collects the necessary information and stores it in a
 * TransformedDocumentNode structure.
 *
 * @remarks
 * When we transform a GraphQL typed document node, we consider two types of nodes:
 * - Data nodes: These nodes represent the fields in the query that are used to fetch data.
 * - Variable nodes: These nodes represent the variables used in the query.
 *
 * @typeParam TData - The type of the data node used in the GraphQL query.
 * @typeParam TVariables - The type of the variables used in the GraphQL query.
 */
export class DocumentNodeTransformer<TData, TVariables> {
  private readonly transformedDataNodes: TransformedDocumentNode[];
  private readonly transformedVariableNodes: TransformedDocumentNode[];

  private fragmentDefinitions: Record<string, FragmentDefinitionNode> = {};

  constructor(
    schema: GraphQLSchema,
    documentNode: TypedDocumentNode<TData, TVariables>,
  ) {
    if (!schema) {
      throw new Error('Schema is required to transform the document node.');
    }

    const typeInfo = new TypeInfo(schema);

    // Collect all fragment definitions first, so that fragment spreads can be processed.
    this.collectFragmentDefinitions(documentNode);

    this.transformedDataNodes = this.transformDataNodes(documentNode, typeInfo);
    this.transformedVariableNodes = this.transformVariableNodes(
      documentNode,
      typeInfo,
    );
  }

  getTransformedDataNodes(): TransformedDocumentNode[] {
    return this.transformedDataNodes;
  }

  getTransformedVariableNodes(): TransformedDocumentNode[] {
    return this.transformedVariableNodes;
  }

  /**
   * Transforms graphql fields or data nodes into TransformedDocumentNode.
   *
   * @param documentNode The document node to transform
   * @param typeInfo The type information of the schema
   *
   * @returns An array of TransformedDocumentNode
   *
   * @private
   */
  private transformDataNodes(
    documentNode: TypedDocumentNode<TData, TVariables>,
    typeInfo: TypeInfo,
  ): TransformedDocumentNode[] {
    const transformedFieldNodes: TransformedDocumentNode[] = [];

    visit(
      documentNode,
      visitWithTypeInfo(typeInfo, {
        Field: {
          enter: (node) => {
            const rawType = typeInfo.getType();
            if (!rawType) return;

            const transformedNode = this.transformFieldNode(
              node,
              rawType,
              typeInfo,
            );
            transformedFieldNodes.push(transformedNode);

            /**
             * By default, visit function traverses depth-first. Since we're recursively traversing the tree using
             * `transformFieldNode` function, visiting only the first level is sufficient. Therefore, we return
             * false, in order to prevent visiting deeper levels.
             */
            return false;
          },
        },
        FragmentDefinition: {
          enter: () => {
            // returning BREAK prevents visiting the node altogether.
            return BREAK;
          },
        },
      }),
    );

    return transformedFieldNodes;
  }

  /**
   * Transforms graphql variables into TransformedDocumentNode.
   *
   * @param documentNode The document node to transform
   * @param typeInfo The type information of the schema
   *
   * @return An array of TransformedDocumentNode
   *
   * @private
   */
  private transformVariableNodes(
    documentNode: TypedDocumentNode<TData, TVariables>,
    typeInfo: TypeInfo,
  ): TransformedDocumentNode[] {
    const transformedVariableNodes: TransformedDocumentNode[] = [];

    visit(
      documentNode,
      visitWithTypeInfo(typeInfo, {
        Variable: {
          enter: (node) => {
            const rawType = typeInfo.getInputType();
            if (!rawType) return;

            const transformedNode = this.transformVariableNode(node, rawType);
            transformedVariableNodes.push(transformedNode);

            return false;
          },
        },
        Field: {
          enter: () => {
            return BREAK;
          },
        },
      }),
    );

    return transformedVariableNodes;
  }

  /**
   * Recursively transforms a field node into a TransformedDocumentNode.
   * It also visits FragmentSpread nodes to transform them.
   *
   * @param node Single field node to transform
   * @param rawType The raw type of the field node.
   * @param typeInfo The type information of the schema
   *
   * @returns a single TransformedDocumentNode
   *
   * @private
   */
  private transformFieldNode(
    node: FieldNode,
    rawType: GraphQLOutputType,
    typeInfo: TypeInfo,
  ): TransformedDocumentNode {
    const children: TransformedDocumentNode[] = [];

    if (node.selectionSet) {
      visit(
        node.selectionSet,
        visitWithTypeInfo(typeInfo, {
          Field: {
            enter: (node) => {
              const rawType = typeInfo.getType();
              if (!rawType) return;

              const transformedNode = this.transformFieldNode(
                node,
                rawType,
                typeInfo,
              );
              children.push(transformedNode);

              return false;
            },
          },
          FragmentSpread: {
            enter: (node) => {
              const transformedFragmentNodes = this.transformFragmentNodes(
                node,
                typeInfo,
              );

              children.push(...transformedFragmentNodes);

              return false;
            },
          },
        }),
      );
    }

    return this.toTransformedDataNode(node.name.value, rawType, children);
  }

  /**
   * Resolves fragment spread nodes by transforming them into TransformedDocumentNode.
   * Fragments may be nested, in which case they are resolved recursively.
   *
   * @param node FragmentSpread node to transform
   * @param typeInfo The type information of the schema
   *
   * @return An array of TransformedDocumentNode
   *
   * @private
   */
  private transformFragmentNodes(
    node: FragmentSpreadNode,
    typeInfo: TypeInfo,
  ): TransformedDocumentNode[] {
    const fragmentName = node.name.value;
    const fragmentDefinition = this.fragmentDefinitions[fragmentName];

    if (!fragmentDefinition) {
      console.warn(`Found an unresolved fragment with a name: ${fragmentName}`);
      return [];
    }

    const transformedNodes: TransformedDocumentNode[] = [];

    visit(
      fragmentDefinition,
      visitWithTypeInfo(typeInfo, {
        Field: {
          enter: (node: FieldNode) => {
            const rawType = typeInfo.getType();
            if (!rawType) return;

            const transformedNode = this.transformFieldNode(
              node,
              rawType,
              typeInfo,
            );
            transformedNodes.push(transformedNode);

            return false;
          },
        },
        FragmentSpread: {
          enter: (node: FragmentSpreadNode) => {
            this.transformFragmentNodes(node, typeInfo);
            return false;
          },
        },
      }),
    );

    return transformedNodes;
  }

  /**
   * Transforms a variable node into a TransformedDocumentNode.
   *
   * @param variableNode The variable node to transform
   * @param rawType The raw type of the variable node.
   *
   * @returns A single TransformedDocumentNode
   *
   * @private
   */
  private transformVariableNode(
    variableNode: VariableNode,
    rawType: GraphQLInputType,
  ): TransformedDocumentNode {
    const namedType = getNamedType(rawType);

    const children: TransformedDocumentNode[] = [];

    if (isInputObjectType(namedType)) {
      return this.resolveInputType(variableNode.name.value, namedType);
    }

    return this.toTransformedDataNode(
      variableNode.name.value,
      rawType,
      children,
    );
  }

  /**
   * Recursively resolves nested object input types.
   *
   * @param fieldName The name of the field
   * @param namedType The named input type
   *
   * @returns A single TransformedDocumentNode
   *
   * @private
   */
  private resolveInputType(
    fieldName: string,
    namedType: GraphQLNamedInputType,
  ): TransformedDocumentNode {
    const children: TransformedDocumentNode[] = [];

    if (isInputObjectType(namedType)) {
      const fields = namedType.getFields();

      Object.entries(fields).forEach(([_, field]) => {
        const namedType = getNamedType(field.type);

        if (isInputObjectType(namedType)) {
          const transformedNode = this.resolveInputType(field.name, namedType);
          children.push(transformedNode);
          return;
        }

        const transformedNode = this.toTransformedDataNode(
          field.name,
          field.type,
          [],
        );

        children.push(transformedNode);
      });
    }

    return this.toTransformedDataNode(fieldName, namedType, children);
  }

  /**
   * Collects all fragment definitions from the document node.
   *
   * @param documentNode The document node to traverse
   *
   * @private
   */
  private collectFragmentDefinitions(
    documentNode: TypedDocumentNode<TData, TVariables>,
  ) {
    visit(documentNode, {
      FragmentDefinition: {
        enter: (node) => {
          this.fragmentDefinitions[node.name.value] = node;
        },
      },
    });
  }

  /**
   * Utility function to convert input information into a TransformedDocumentNode.
   *
   * @remarks
   * One noteworthy information is the difference between rawType and namedType:
   * - rawType: A namedType with the additional information of whether the type is required or an array.
   * For example: `String!` or `[Number!]!`.
   * - namedType: A type stripped of the additional information. For example: `String` or `Number`.
   *
   * @param fieldName The name of the field
   * @param rawType The raw type of the field (Either input or output type)
   * @param children The children of the field
   *
   * @returns A single TransformedDocumentNode
   *
   * @private
   */
  private toTransformedDataNode(
    fieldName: string,
    rawType: GraphQLInputType | GraphQLOutputType,
    children: TransformedDocumentNode[],
  ): TransformedDocumentNode {
    const namedType: GraphQLNamedType = getNamedType(rawType);
    const isList = isListType(
      isNonNullType(rawType) ? rawType.ofType : rawType,
    );
    const isNonNull = isNonNullType(rawType);
    const isScalar = isScalarType(namedType);
    const isEnum = isEnumType(namedType);

    return {
      fieldName,
      isScalar,
      isEnum,
      fieldType: namedType.toString(),
      isRequired: isNonNull,
      isArray: isList,
      isCustomScalar: isScalar && this.isCustomScalar(namedType),
      enumValues: isEnum
        ? (namedType as GraphQLEnumType)
            .getValues()
            .map((enumValue) => enumValue.name)
        : undefined,
      children: children.length > 0 ? children : undefined,
    };
  }

  private isCustomScalar(type: GraphQLNamedType): boolean {
    return !GraphQLTypeMapper.SUPPORTED_SCALARS.includes(type.name);
  }
}
