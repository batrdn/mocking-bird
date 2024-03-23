import { GraphQLSchema, print } from 'graphql';
import { buildSchema } from 'graphql/utilities';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';

export const buildGraphQLSchema = (): GraphQLSchema => {
  console.log(__dirname);
  const schemaContent = readFileSync(
    path.resolve(__dirname, '../generated/schema.graphql'),
    'utf-8',
  );

  return buildSchema(schemaContent);
};
