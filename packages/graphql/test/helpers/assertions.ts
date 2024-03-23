import { GraphQLFixtureResult } from '../../src/type';
import {
  AddItemMutation,
  AddItemMutationVariables,
  GetCartQuery,
  GetCartQueryVariables,
  GetCartWithFragmentQuery,
  GetCartWithFragmentQueryVariables,
} from '../generated/types';

export const assertGetCartQuery = (
  result: GraphQLFixtureResult<GetCartQuery, GetCartQueryVariables>,
): void => {
  const { data } = result;

  expect(data).toEqual({
    cart: {
      id: expect.any(String),
      email: expect.any(String),
      totalItems: expect.any(Number),
      isEmpty: expect.any(Boolean),
      abandoned: expect.any(Boolean),
      metadata: expect.any(Object),
      notes: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      subTotal: {
        formatted: expect.any(String),
        amount: expect.any(Number),
      },
      items: [
        {
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          type: expect.any(String),
          images: [expect.any(String)],
          unitTotal: {
            amount: expect.any(Number),
            currency: {
              code: expect.any(String),
              symbol: expect.any(String),
              thousandsSeparator: expect.any(String),
              decimalSeparator: expect.any(String),
              decimalDigits: expect.any(Number),
            },
            formatted: expect.any(String),
          },
          lineTotal: {
            amount: expect.any(Number),
          },
          quantity: expect.any(Number),
          attributes: [
            {
              key: expect.any(String),
              value: expect.any(String),
            },
          ],
          metadata: expect.any(Object),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ],
    },
  });
};

export const assertGetCartFragmentQuery = (
  result: GraphQLFixtureResult<
    GetCartWithFragmentQuery,
    GetCartWithFragmentQueryVariables
  >,
): void => {
  const { data } = result;

  expect(data).toEqual({
    cart: {
      id: expect.any(String),
      items: [
        {
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          unitTotal: {
            amount: expect.any(Number),
            currency: {
              code: expect.any(String),
              symbol: expect.any(String),
            },
          },
        },
      ],
    },
  });
};

export const assertAddItemMutation = (
  result: GraphQLFixtureResult<AddItemMutation, AddItemMutationVariables>,
): void => {
  const { variables } = result;

  expect(variables.input).toEqual({
    id: expect.any(String),
    attributes: expect.any(Object),
    cartId: expect.any(String),
    currency: {
      code: expect.any(String),
      decimalDigits: expect.any(Number),
      decimalSeparator: expect.any(String),
      symbol: expect.any(String),
      thousandsSeparator: expect.any(String),
    },
    description: expect.any(String),
    images: [expect.any(String)],
    metadata: expect.any(Object),
    name: expect.any(String),
    price: expect.any(Number),
    quantity: expect.any(Number),
    type: expect.any(String),
  });
};
