export type Value = string | number | bigint | boolean | Date | Buffer | object;

export type FieldPath = string;

export type FakerCandidate = {
  type: FieldType;
  function: string;
  module: string;
  callback: (rule?: Rule) => Value;
};

export enum FieldType {
  STRING = 'string',
  NUMBER = 'number',
  FLOAT = 'float',
  BIGINT = 'bigint',
  BOOLEAN = 'boolean',
  DATE = 'date',
  BUFFER = 'buffer',
  ARRAY = 'array',
  MONGO_DB_ID = 'mongo_db_id',
  UUID = 'uuid',
  OBJECT = 'object',
}

export type NonArrayFieldType = Exclude<FieldType, FieldType.ARRAY>;

export type Rule = {
  path: FieldPath;
  required?: boolean;
  size?: number;
  min?: number;
  max?: number;
  enum?: (string | number)[];
  pattern?: RegExp;
};

export interface FixtureOptions {
  rules?: Rule[];
  exclude?: FieldPath[];
  requiredOnly?: boolean;
}
