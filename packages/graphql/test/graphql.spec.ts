import { GraphQLFixture } from '../src';
import {
  AddItemDocument,
  AddItemMutation,
  AddItemMutationVariables,
  GetAllMortalBeingsDocument,
  GetCartDocument,
  GetCartQuery,
  GetCartQueryVariables,
  GetCartWithFragmentDocument,
  GetCartWithNestedFragmentDocument,
} from './generated/types';
import {
  assertAddItemMutation,
  assertGetCartFragmentQuery,
  assertGetCartQuery,
  buildGraphQLSchema,
} from './helpers';
import { FieldType } from '@mocking-bird/core';

describe('Mocking Bird - GraphQL', () => {
  const schema = buildGraphQLSchema();

  GraphQLFixture.registerSchema(schema);

  describe('Mock for Query', () => {
    let fixture: GraphQLFixture<GetCartQuery, GetCartQueryVariables>;

    beforeAll(() => {
      fixture = new GraphQLFixture(GetCartDocument);
    });

    it('should generate mock for query', () => {
      const mock = fixture.generate();
      assertGetCartQuery(mock);
    });

    it('should override field value', () => {
      const { data } = fixture.generate({
        'cart.subTotal.amount': 100,
      });

      expect(data.cart?.subTotal.amount).toBe(100);
    });

    // TODO: not sure if this case makes sense in graphql
    it.skip('should generate mock with only required fields', () => {
      fixture.generate({}, { requiredOnly: true });
    });

    it('should exclude specified fields', () => {
      const mock = fixture.generate({}, { exclude: ['cart.email'] });

      expect(mock.data.cart?.email).toBeUndefined();
    });

    it('should generate mock with correct field relations', () => {
      const fieldRelations = {
        'variables.id': 'data.cart.id',
      };

      const { data, variables } = fixture.generate({}, { fieldRelations });

      expect(variables.id).toBeDefined();
      expect(data.cart).toBeDefined();
      expect(data.cart?.id).toBeDefined();
      expect(data.cart?.id).toBe(variables.id);
    });

    it('should throw an error if a required field is excluded', () => {
      expect(() =>
        fixture.generate({}, { exclude: ['cart.subTotal'] }),
      ).toThrow('Cannot exclude required field: cart.subTotal');
    });
  });

  describe('Mock with Fragment', () => {
    it('should generate mock for query with fragment', () => {
      const fixture = new GraphQLFixture(GetCartWithFragmentDocument);
      const mock = fixture.generate();

      assertGetCartFragmentQuery(mock);
    });

    it('should generate mock for query with nested fragments', () => {
      const fixture = new GraphQLFixture(GetCartWithNestedFragmentDocument);

      const { data } = fixture.generate();

      expect(data.cart?.items).toEqual([
        {
          unitTotal: {
            amount: expect.any(Number),
            currency: {
              code: expect.any(String),
              symbol: expect.any(String),
            },
          },
        },
      ]);
    });
  });

  describe('Mock for Mutation', () => {
    let fixture: GraphQLFixture<AddItemMutation, AddItemMutationVariables>;

    beforeAll(() => {
      fixture = new GraphQLFixture(AddItemDocument);
    });

    it('should generate mock for mutation', () => {
      const mock = fixture.generate();
      assertAddItemMutation(mock);
    });

    it('should override variable value', () => {
      const { variables } = fixture.generate({
        'input.price': 100,
      });

      expect(variables.input.price).toBe(100);
    });
  });

  describe('Custom Scalar Type', () => {
    const fixture = new GraphQLFixture(GetAllMortalBeingsDocument);

    it('should ignore custom scalars', () => {
      const { data } = fixture.generate({}, { ignoreCustomScalars: true });
      expect(data.mortalBeings[0].birth).toBeUndefined();
    });

    it('should generate a mock based on custom scalar definition', () => {
      const { data } = fixture.generate(
        {},
        {
          scalarDefinitions: {
            BeforeChristDate: {
              type: FieldType.DATE,
              defaultValue: '2021-01-01',
            },
          },
        },
      );

      expect(data.mortalBeings[0].birth).toEqual(expect.any(Date));
    });
  });

  describe('Typename', () => {
    it('should add typename to the result', () => {
      const fixture = new GraphQLFixture(GetAllMortalBeingsDocument);
      const { data } = fixture.generate({}, { addTypeName: true });

      expect(data.__typename).toBe('MortalBeing');
    });
  });

  describe('Custom rules', () => {
    let fixture: GraphQLFixture<GetCartQuery, GetCartQueryVariables>;

    beforeAll(() => {
      fixture = new GraphQLFixture(GetCartDocument);
    });

    it('should create a mock based on regex pattern', () => {
      const mock = fixture.generate(
        {},
        {
          rules: [
            {
              path: 'cart.email',
              pattern: /[A-Z].+@gmail.com/,
            },
          ],
        },
      );

      expect(mock.data.cart?.email).toMatch(/[A-Z].+@gmail\.com/);
    });

    it('should create a mock based on enum', () => {
      const mock = fixture.generate(
        {},
        {
          rules: [
            {
              path: 'cart.items.unitTotal.currency.code',
              enum: ['USD', 'EUR', 'GBP'],
            },
          ],
        },
      );

      expect(mock.data.cart?.items[0].unitTotal.currency.code).toMatch(
        /USD|EUR|GBP/,
      );
    });

    it('should generate a mock based on size', () => {
      const mock = fixture.generate(
        {},
        {
          rules: [
            {
              path: 'cart.items',
              size: 5,
            },
          ],
        },
      );

      expect(mock.data.cart?.items).toHaveLength(5);
    });

    it('should generate a mock based on min value', () => {
      const mock = fixture.generate(
        {},
        {
          rules: [
            {
              path: 'cart.subTotal.amount',
              min: 100,
            },
          ],
        },
      );

      expect(mock.data.cart?.subTotal.amount).toBeGreaterThanOrEqual(100);
    });

    it('should generate a mock based on max value', () => {
      const mock = fixture.generate(
        {},
        {
          rules: [
            {
              path: 'cart.subTotal.amount',
              max: 100,
            },
          ],
        },
      );

      expect(mock.data.cart?.subTotal.amount).toBeLessThanOrEqual(100);
    });

    it('should generate a mock based on min-max value', () => {
      const mock = fixture.generate(
        {},
        {
          rules: [
            {
              path: 'cart.subTotal.amount',
              min: 100,
              max: 200,
            },
          ],
        },
      );

      expect(mock.data.cart?.subTotal.amount).toBeGreaterThanOrEqual(100);
      expect(mock.data.cart?.subTotal.amount).toBeLessThanOrEqual(200);
    });
  });
});
