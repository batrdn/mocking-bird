import { AbstractTypeMapper, FieldType } from '@mocking-bird/core';

export class MongooseTypeMapper extends AbstractTypeMapper {
  getType(type: string): FieldType {
    throw new Error('Not implemented');
  }
}
