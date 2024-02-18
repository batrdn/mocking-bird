import { MongoDBContainer } from '@testcontainers/mongodb';
import * as mongoose from 'mongoose';
import { MongooseFixture } from '../src';
import { BasicModel, NestedModel } from './models';

describe('MongoDB Integration Test', () => {
  beforeAll(async () => {
    const mongodbContainer = await new MongoDBContainer().start();

    await mongoose.connect(mongodbContainer.getConnectionString(), {
      directConnection: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should save a basic document to the database', async () => {
    const fixture = new MongooseFixture(BasicModel);
    const document = fixture.generate();

    const { _id } = await BasicModel.create(document);
    expect(_id).toBeDefined();

    const savedDocument = await BasicModel.findById(_id).lean().exec();
    const expectedDocument = {
      ...document,
      _id: savedDocument?._id?.toString(),
      idField: savedDocument?.idField?.toString(),
      bigInt: savedDocument?.bigInt?.toString(),
      decimal128: savedDocument?.decimal128?.toString(),
    };

    expect(expectedDocument).toMatchObject({
      ...document,
      bigInt: document.bigInt?.toString(),
      decimal128: document.decimal128?.toString(),
    });
  });

  it('should save a nested document to the database', async () => {
    const fixture = new MongooseFixture(NestedModel);
    const document = fixture.generate();

    const nestedDoc = new NestedModel(document);
    const savedDoc = await nestedDoc.save();
    expect(savedDoc).toBeDefined();

    const error = nestedDoc.validateSync();
    expect(error).toBeUndefined();
  });
});
