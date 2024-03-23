import {
  CoreTypeMapper,
  FieldType,
  NonArrayFieldType,
} from '@mocking-bird/core';

export class GraphQLTypeMapper extends CoreTypeMapper {
  public static readonly SUPPORTED_SCALARS = [
    'String',
    'Int',
    'Float',
    'Boolean',
    'ID',
    'DateTime',
    'Date',
    'Json',
  ];

  override getType(type: string): FieldType {
    switch (type) {
      case 'String':
        return FieldType.STRING;
      case 'Int':
        return FieldType.NUMBER;
      case 'Float':
        return FieldType.FLOAT;
      case 'Boolean':
        return FieldType.BOOLEAN;
      case 'ID':
        return FieldType.UUID;
      case 'DateTime':
      case 'Date':
        return FieldType.DATE;
      default:
        return FieldType.OBJECT;
    }
  }

  override getArrayType(_: string): NonArrayFieldType {
    throw new Error('Use getType instead of getArrayType for GraphQL types');
  }
}
