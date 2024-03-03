import {
  CoreTypeMapper,
  FieldType,
  NonArrayFieldType,
} from '@mocking-bird/core';

export class MongooseTypeMapper extends CoreTypeMapper {
  private static readonly SUPPORTED_TYPES = [
    'string',
    'number',
    'date',
    'buffer',
    'boolean',
    'mixed',
    'objectid',
    'array',
    'decimal128',
    'map',
    'schema',
    'uuid',
    'bigint',
  ];

  override getType(type: string): FieldType {
    const mongooseType = type.toLowerCase();
    this.validateType(mongooseType);

    switch (mongooseType) {
      case 'objectid':
        return FieldType.MONGO_DB_ID;
      case 'string':
        return FieldType.STRING;
      case 'number':
        return FieldType.NUMBER;
      case 'boolean':
        return FieldType.BOOLEAN;
      case 'date':
        return FieldType.DATE;
      case 'buffer':
        return FieldType.BUFFER;
      case 'array':
        return FieldType.ARRAY;
      case 'decimal128':
        return FieldType.FLOAT;
      case 'uuid':
        return FieldType.UUID;
      case 'bigint':
        return FieldType.BIGINT;
      case 'map':
      case 'mixed':
      case 'schema':
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
