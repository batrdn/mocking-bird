import { Schema, model } from 'mongoose';

export interface IBasicDocument {
  firstname: string;
  lastname: string;
  date: Date;
  isDefault: boolean;
  age?: number;
  email?: string;
  binData?: Buffer;
  idField?: Schema.Types.ObjectId;
  uuid?: Schema.Types.UUID;
  bigInt?: Schema.Types.BigInt;
  decimal128?: Schema.Types.Decimal128;
  array?: string[];
  enum?: 'A' | 'B' | 'C';
  customValidation?: string;
  promisedNeverLand?: string;
}

export const BasicDocumentSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  date: { type: Date, required: true },
  isDefault: { type: Boolean, default: false },
  age: { type: Number, min: 18, max: 99 },
  email: String,
  binData: Buffer,
  idField: Schema.Types.ObjectId,
  uuid: Schema.Types.UUID,
  bigInt: Schema.Types.BigInt,
  decimal128: Schema.Types.Decimal128,
  array: [String],
  enum: { type: String, enum: ['A', 'B', 'C'] },
  customValidation: { type: String, validate: (v: string) => v.length < 3 },
});

export const BasicModel = model<IBasicDocument>(
  'BasicDocument',
  BasicDocumentSchema,
  'BasicDocuments'
);
