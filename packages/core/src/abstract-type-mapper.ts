import { FieldType, NonArrayFieldType } from './types';

export abstract class AbstractTypeMapper {
  abstract getType(type: string): FieldType;

  abstract getArrayType(type: string): NonArrayFieldType;
}
