import { FieldType, NonArrayFieldType } from './types';

/**
 * ### Overview
 *
 * CoreTypeMapper is an abstract class that provides the basic functionality for mapping field types.
 * It is designed to abstract the field type mapping logic by receiving a generic field type as string, and
 * reinforces the types used throughout the library.
 */
export abstract class CoreTypeMapper {
  /**
   * Maps the given field type to `FieldType`.
   *
   * @virtual
   *
   * @returns The mapped field type.
   *
   * @param type The field type to map.
   */
  abstract getType(type: string): FieldType;

  /**
   * Maps the given field type to `NonArrayFieldType`.
   * `NonArrayFieldType` is a subset of `FieldType` that excludes array.
   *
   * @virtual
   *
   * @returns The mapped non-array field type.
   *
   * @param type
   */
  abstract getArrayType(type: string): NonArrayFieldType;
}
