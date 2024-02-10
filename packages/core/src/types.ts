export enum FieldType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  BUFFER = 'buffer',
  ARRAY = 'array',
}

export type Value = string | number | boolean | Date | Buffer | object;

export type Rule = {
  path: FieldPath;
  required?: boolean;
  size?: number;
  min?: number;
  max?: number;
  enum?: (string | number)[];
  pattern?: RegExp;
};

export type FieldPath = string;

export interface FixtureOptions {
  rules?: Rule[];
  exclude?: FieldPath[];
  requiredOnly?: boolean;
}
