import {
  FieldPath,
  FixtureOptions,
  NonArrayFieldType,
} from '@mocking-bird/core';

export interface GraphQLFixtureOptions extends FixtureOptions {
  ignoreCustomScalars?: boolean;
  addTypeName?: boolean;
  scalarDefinitions?: Record<string, ScalarDefinition>;
  fieldRelations?:
    | Record<FieldPath, FieldPath>
    | Record<FieldPath, FieldPath[]>;
}

export type GraphQLFixtureResult<TData, TVariables> = {
  data: TData;
  variables: TVariables;
};

export type ScalarDefinition = {
  type: NonArrayFieldType;
  defaultValue: any;
};

export type TransformedDocumentNode = {
  fieldName: string;
  fieldType: string;
  isRequired: boolean;
  isArray?: boolean;
  isScalar?: boolean;
  isCustomScalar?: boolean;
  isEnum?: boolean;
  enumValues?: string[];
  children?: TransformedDocumentNode[];
};
