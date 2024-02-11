export enum FieldType {
  STRING = 'string',
  NUMBER = 'number',
  FLOAT = 'float',
  BIGINT = 'bigint',
  BOOLEAN = 'boolean',
  DATE = 'date',
  BUFFER = 'buffer',
  ARRAY = 'array',
  HEXSTRING = 'hexstring',
  UUID = 'uuid',
  OBJECT = 'object',
}

export type Value = string | number | bigint | boolean | Date | Buffer | object;

export type Rule = {
  path: FieldPath;
  required?: boolean;
  size?: number;
  min?: number;
  max?: number;
  enum?: (string | number)[];
  pattern?: RegExp;
};

/**
 * TODO: Explain
 */
export type FieldPath = string;

export interface FixtureOptions {
  rules?: Rule[];
  exclude?: FieldPath[];
  requiredOnly?: boolean;
}
