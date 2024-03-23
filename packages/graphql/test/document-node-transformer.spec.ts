import { buildGraphQLSchema } from './helpers';
import { DocumentNodeTransformer } from '../src/document-node-transformer';
import {
  AddItemDocument,
  GetCartDocument,
  GetCartWithFragmentDocument,
} from './generated/types';
import { loadFixture } from './helpers/load-fixture';
import * as path from 'path';

describe('DocumentNodeTransformer', () => {
  const schema = buildGraphQLSchema();

  it('should transform the query', () => {
    const transformer = new DocumentNodeTransformer(schema, GetCartDocument);

    const dataNodes = transformer.getTransformedDataNodes();
    const variableNodes = transformer.getTransformedVariableNodes();

    const { variables, data } = loadFixture(
      path.resolve('test/fixtures/get-cart.json'),
    );

    expect(dataNodes).toEqual(data);
    expect(variableNodes).toEqual(variables);
  });

  it('should transform the mutation', () => {
    const transformer = new DocumentNodeTransformer(schema, AddItemDocument);

    const dataNodes = transformer.getTransformedDataNodes();
    const variableNodes = transformer.getTransformedVariableNodes();

    const { variables, data } = loadFixture(
      path.resolve('test/fixtures/add-item.json'),
    );

    expect(dataNodes).toEqual(data);
    expect(variableNodes).toEqual(variables);
  });

  it('should transformer the query with fragment', () => {
    const transformer = new DocumentNodeTransformer(
      schema,
      GetCartWithFragmentDocument,
    );

    const dataNodes = transformer.getTransformedDataNodes();
    const variableNodes = transformer.getTransformedVariableNodes();

    const { variables, data } = loadFixture(
      path.resolve('test/fixtures/get-cart-with-fragment.json'),
    );

    expect(dataNodes).toEqual(data);
    expect(variableNodes).toEqual(variables);
  });
});
