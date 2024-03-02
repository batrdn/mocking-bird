import { model, Schema } from 'mongoose';

export type UserAddress = Record<
  string,
  {
    street: string;
    buildingNo: number;
  }[]
>;

export type UserInfo = Record<
  string,
  {
    name: string;
    age: number;
    address: UserAddress;
  }[]
>;

export interface IMapDocument {
  userAddress: UserAddress[];
  userInfo: UserInfo;
  basicInfo: Record<string, string>;
}

export const MapDocumentSchema = new Schema({
  userAddress: {
    type: Schema.Types.Map,
    of: [
      new Schema({
        street: { type: String },
        buildingNo: { type: Number },
      }),
    ],
  },
  userInfo: {
    type: Schema.Types.Map,
    of: new Schema({
      name: { type: String },
      age: { type: Number },
      address: {
        type: Schema.Types.Map,
        of: new Schema({
          street: { type: String },
          buildingNo: { type: Number },
        }),
      },
    }),
  },
  basicInfo: {
    type: Schema.Types.Map,
    of: String,
  },
});

export const MapModel = model<IMapDocument>(
  'MapDocument',
  MapDocumentSchema,
  'MapDocuments',
);
