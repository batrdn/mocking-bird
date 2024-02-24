import {
  CoreTypeMapper,
  FieldType,
  NonArrayFieldType,
} from '@mocking-bird/core';

export class MongooseTypeMapper extends CoreTypeMapper {
  private static readonly SUPPORTED_TYPES = [
    'String',
    'Number',
    'Date',
    'Buffer',
    'Boolean',
    'Mixed',
    'ObjectId',
    'Array',
    'Decimal128',
    'Map',
    'Schema',
    'UUID',
    'BigInt',
  ];

  override getType(type: string): FieldType {
    this.validateType(type);

    switch (type) {
      case 'ObjectId':
        return FieldType.MONGO_DB_ID;
      case 'String':
        return FieldType.STRING;
      case 'Number':
        return FieldType.NUMBER;
      case 'Boolean':
        return FieldType.BOOLEAN;
      case 'Date':
        return FieldType.DATE;
      case 'Buffer':
        return FieldType.BUFFER;
      case 'Array':
        return FieldType.ARRAY;
      case 'Decimal128':
        return FieldType.FLOAT;
      case 'UUID':
        return FieldType.UUID;
      case 'BigInt':
        return FieldType.BIGINT;
      case 'Mixed':
      case 'Map':
      case 'Schema':
        return FieldType.OBJECT;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  }

  override getArrayType(type: string): NonArrayFieldType {
    if (type === 'Array') {
      throw new Error('Unsupported type: Array');
    }

    return this.getType(type) as NonArrayFieldType;
  }

  private validateType(type: string): void {
    if (!MongooseTypeMapper.SUPPORTED_TYPES.includes(type)) {
      throw new Error(`Unsupported type: ${type}`);
    }
  }
}
