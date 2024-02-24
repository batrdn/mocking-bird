import { Schema, model } from 'mongoose';

interface IChild {
  name: string;
  isNested: boolean;
  isChild: boolean;
  values: number[];
}

export interface IObjectDocument {
  child: IChild;
  children: [IChild];
}

export interface IMixedDocument {
  mixedAnyObject: object;
  mixedArray: object[];
}

export interface INestedDocument {
  complexObject: IObjectDocument;
  mixedType: IMixedDocument;
}

const ChildSchema = new Schema({
  name: String,
  isChild: Boolean,
  isNested: Boolean,
  values: [Number],
});

const ComplexObjectSchema = new Schema({
  child: ChildSchema,
  children: [ChildSchema],
});

const MixedTypeSchema = new Schema({
  mixedAnyObject: Schema.Types.Mixed,
  mixedArray: [Schema.Types.Mixed],
});

const NestedDocumentSchema = new Schema({
  complexObject: ComplexObjectSchema,
  mixedType: MixedTypeSchema,
});

export const NestedModel = model<INestedDocument>(
  'NestedDocument',
  NestedDocumentSchema,
  'NestedDocuments'
);
