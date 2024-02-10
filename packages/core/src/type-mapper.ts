import { FieldType } from './types';

export abstract class AbstractTypeMapper {
  abstract getType(type: string): FieldType;
}
