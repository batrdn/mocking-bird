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

export class DocumentNodeTransformer<TData, TVariables> {
  private readonly transformedDataNodes: TransformedDocumentNode[];
  private readonly transformedVariableNodes: TransformedDocumentNode[];

  private fragmentDefinitions: Record<string, FragmentDefinitionNode> = {};

  constructor(
    schema: GraphQLSchema,
    documentNode: TypedDocumentNode<TData, TVariables>,
  ) {
    const typeInfo = new TypeInfo(schema);

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

            return false;
          },
        },
        FragmentDefinition: {
          enter: () => {
            return BREAK;
          },
        },
      }),
    );

    return transformedFieldNodes;
  }

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
