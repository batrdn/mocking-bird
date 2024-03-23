import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BeforeChristDate: { input: any; output: any; }
  Date: { input: any; output: any; }
  Json: { input: any; output: any; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any; }
};

export type AddToCartInput = {
  attributes?: InputMaybe<Array<InputMaybe<CustomAttributeInput>>>;
  cartId: Scalars['ID']['input'];
  currency?: InputMaybe<CurrencyInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  images?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  metadata?: InputMaybe<Scalars['Json']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Int']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<CartItemType>;
};

/** Addresses are associated with Orders. They can either be shipping or billing addresses. */
export type Address = {
  __typename?: 'Address';
  /** Use this to keep the city/town name. */
  city: Scalars['String']['output'];
  /** Use this to keep an optional company name for addresses. */
  company?: Maybe<Scalars['String']['output']>;
  /** Use this to keep the country name. */
  country: Scalars['String']['output'];
  /** Use this to keep the first line of the address. */
  line1: Scalars['String']['output'];
  /** Use this to keep the apartment, door number, etc. */
  line2?: Maybe<Scalars['String']['output']>;
  /** Use this to keep the name of the recipient. */
  name: Scalars['String']['output'];
  /** Use this to keep the post/postal/zip code. */
  postalCode: Scalars['String']['output'];
  /** Use this to keep the state/county name. */
  state?: Maybe<Scalars['String']['output']>;
};

export type AddressInput = {
  city: Scalars['String']['input'];
  company?: InputMaybe<Scalars['String']['input']>;
  country: Scalars['String']['input'];
  line1: Scalars['String']['input'];
  line2?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
  state?: InputMaybe<Scalars['String']['input']>;
};

export type Animal = Being & {
  __typename?: 'Animal';
  birth: Scalars['BeforeChristDate']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  paysTaxes: Scalars['Boolean']['output'];
  species?: Maybe<Scalars['String']['output']>;
};

export type Being = {
  birth: Scalars['BeforeChristDate']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  paysTaxes: Scalars['Boolean']['output'];
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

/** Carts are the core concept of CartQL. Bring your own PIM and use CartQL to calculate your Cart and Checkout. */
export type Cart = Node & {
  __typename?: 'Cart';
  /** A simple helper method to check if the cart hasn't been updated in the last 2 hours. */
  abandoned?: Maybe<Scalars['Boolean']['output']>;
  /** Custom key/value attributes array for the cart. */
  attributes: Array<CustomCartAttribute>;
  /** The date and time the cart was created. */
  createdAt: Scalars['Date']['output'];
  /** The current currency details of the cart. */
  currency: Currency;
  /** The customer for the cart */
  email?: Maybe<Scalars['String']['output']>;
  /** The grand total for all items, including shipping, including the raw/formatted amounts and currency details. */
  grandTotal: Money;
  /** A custom unique identifer for the cart provided by you. */
  id: Scalars['ID']['output'];
  /** A simple helper method to check if the cart is empty. */
  isEmpty?: Maybe<Scalars['Boolean']['output']>;
  /** The items currently in the cart. */
  items: Array<CartItem>;
  /** Custom meta object for the cart */
  metadata?: Maybe<Scalars['Json']['output']>;
  /** Any notes related to the cart/checkout */
  notes?: Maybe<Scalars['String']['output']>;
  /** The cart total for all items with type SHIPPING, including the raw/formatted amounts and currency details. */
  shippingTotal: Money;
  /** Sum of all SKU items, excluding discounts, taxes, shipping, including the raw/formatted amounts and currency details */
  subTotal: Money;
  /** The cart total for all items with type TAX, including the raw/formatted amounts and currency details. */
  taxTotal: Money;
  /** The number of total items in the cart */
  totalItems?: Maybe<Scalars['Int']['output']>;
  /** The number of total unique items in the cart. */
  totalUniqueItems?: Maybe<Scalars['Int']['output']>;
  /** The date and time the cart was updated. */
  updatedAt: Scalars['Date']['output'];
};

/** A Cart Item is used to store data on the items inside the Cart. There are no strict rules about what you use the named fields for. */
export type CartItem = {
  __typename?: 'CartItem';
  /** Custom key/value attributes array for the item. */
  attributes: Array<CustomCartAttribute>;
  /** The date and time the item was created. */
  createdAt: Scalars['Date']['output'];
  /** Description for the item. */
  description?: Maybe<Scalars['String']['output']>;
  /** A custom unique identifer for the item provided by you. */
  id: Scalars['ID']['output'];
  /** Array of image URLs for the item. */
  images?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Line total (quantity * unit price). */
  lineTotal: Money;
  /** Custom metadata for the item. */
  metadata?: Maybe<Scalars['Json']['output']>;
  /** Name for the item. */
  name?: Maybe<Scalars['String']['output']>;
  /** Quantity for the item. */
  quantity: Scalars['Int']['output'];
  /** The type of cart item this is. */
  type: CartItemType;
  /** Unit total for the individual item. */
  unitTotal: Money;
  /** The date and time the item was updated. */
  updatedAt: Scalars['Date']['output'];
};

/** Use these enums to group cart items. Cart totals will reflect these enums. */
export enum CartItemType {
  Shipping = 'SHIPPING',
  Sku = 'SKU',
  Tax = 'TAX'
}

export type CheckoutInput = {
  billing?: InputMaybe<AddressInput>;
  cartId: Scalars['ID']['input'];
  email: Scalars['String']['input'];
  metadata?: InputMaybe<Scalars['Json']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  shipping: AddressInput;
};

/** Cart and Cart Items use the currency object to format their unit/line totals. */
export type Currency = {
  __typename?: 'Currency';
  /** The currency code, e.g. USD, GBP, EUR */
  code?: Maybe<CurrencyCode>;
  /** The decimal places for the currency */
  decimalDigits?: Maybe<Scalars['Int']['output']>;
  /** The decimal separator, e.g. '.' */
  decimalSeparator?: Maybe<Scalars['String']['output']>;
  /** The currency smybol, e.g. $, £, € */
  symbol?: Maybe<Scalars['String']['output']>;
  /** The thousand separator, e.g. ',', '.' */
  thousandsSeparator?: Maybe<Scalars['String']['output']>;
};

export enum CurrencyCode {
  Aed = 'AED',
  Afn = 'AFN',
  All = 'ALL',
  Amd = 'AMD',
  Ang = 'ANG',
  Aoa = 'AOA',
  Ars = 'ARS',
  Aud = 'AUD',
  Awg = 'AWG',
  Azn = 'AZN',
  Bam = 'BAM',
  Bbd = 'BBD',
  Bdt = 'BDT',
  Bgn = 'BGN',
  Bhd = 'BHD',
  Bif = 'BIF',
  Bmd = 'BMD',
  Bnd = 'BND',
  Bob = 'BOB',
  Brl = 'BRL',
  Bsd = 'BSD',
  Btc = 'BTC',
  Btn = 'BTN',
  Bwp = 'BWP',
  Byr = 'BYR',
  Bzd = 'BZD',
  Cad = 'CAD',
  Cdf = 'CDF',
  Chf = 'CHF',
  Clp = 'CLP',
  Cny = 'CNY',
  Cop = 'COP',
  Crc = 'CRC',
  Cuc = 'CUC',
  Cup = 'CUP',
  Cve = 'CVE',
  Czk = 'CZK',
  Djf = 'DJF',
  Dkk = 'DKK',
  Dop = 'DOP',
  Dzd = 'DZD',
  Egp = 'EGP',
  Ern = 'ERN',
  Etb = 'ETB',
  Eur = 'EUR',
  Fjd = 'FJD',
  Fkp = 'FKP',
  Gbp = 'GBP',
  Gel = 'GEL',
  Ghs = 'GHS',
  Gip = 'GIP',
  Gmd = 'GMD',
  Gnf = 'GNF',
  Gtq = 'GTQ',
  Gyd = 'GYD',
  Hkd = 'HKD',
  Hnl = 'HNL',
  Hrk = 'HRK',
  Htg = 'HTG',
  Huf = 'HUF',
  Idr = 'IDR',
  Ils = 'ILS',
  Inr = 'INR',
  Iqd = 'IQD',
  Irr = 'IRR',
  Isk = 'ISK',
  Jmd = 'JMD',
  Jod = 'JOD',
  Jpy = 'JPY',
  Kes = 'KES',
  Kgs = 'KGS',
  Khr = 'KHR',
  Kmf = 'KMF',
  Kpw = 'KPW',
  Krw = 'KRW',
  Kwd = 'KWD',
  Kyd = 'KYD',
  Kzt = 'KZT',
  Lak = 'LAK',
  Lbp = 'LBP',
  Lkr = 'LKR',
  Lrd = 'LRD',
  Lsl = 'LSL',
  Lyd = 'LYD',
  Mad = 'MAD',
  Mdl = 'MDL',
  Mga = 'MGA',
  Mkd = 'MKD',
  Mmk = 'MMK',
  Mnt = 'MNT',
  Mop = 'MOP',
  Mro = 'MRO',
  Mtl = 'MTL',
  Mur = 'MUR',
  Mvr = 'MVR',
  Mwk = 'MWK',
  Mxn = 'MXN',
  Myr = 'MYR',
  Mzn = 'MZN',
  Nad = 'NAD',
  Ngn = 'NGN',
  Nio = 'NIO',
  Nok = 'NOK',
  Npr = 'NPR',
  Nzd = 'NZD',
  Omr = 'OMR',
  Pab = 'PAB',
  Pen = 'PEN',
  Pgk = 'PGK',
  Php = 'PHP',
  Pkr = 'PKR',
  Pln = 'PLN',
  Pyg = 'PYG',
  Qar = 'QAR',
  Ron = 'RON',
  Rsd = 'RSD',
  Rub = 'RUB',
  Rwf = 'RWF',
  Sar = 'SAR',
  Sbd = 'SBD',
  Scr = 'SCR',
  Sdd = 'SDD',
  Sdg = 'SDG',
  Sek = 'SEK',
  Sgd = 'SGD',
  Shp = 'SHP',
  Sll = 'SLL',
  Sos = 'SOS',
  Srd = 'SRD',
  Std = 'STD',
  Svc = 'SVC',
  Syp = 'SYP',
  Szl = 'SZL',
  Thb = 'THB',
  Tjs = 'TJS',
  Tmt = 'TMT',
  Tnd = 'TND',
  Top = 'TOP',
  Try = 'TRY',
  Ttd = 'TTD',
  Tvd = 'TVD',
  Twd = 'TWD',
  Tzs = 'TZS',
  Uah = 'UAH',
  Ugx = 'UGX',
  Usd = 'USD',
  Uyu = 'UYU',
  Uzs = 'UZS',
  Veb = 'VEB',
  Vef = 'VEF',
  Vnd = 'VND',
  Vuv = 'VUV',
  Won = 'WON',
  Wst = 'WST',
  Xaf = 'XAF',
  Xbt = 'XBT',
  Xcd = 'XCD',
  Xof = 'XOF',
  Xpf = 'XPF',
  Yer = 'YER',
  Zar = 'ZAR',
  Zmw = 'ZMW'
}

export type CurrencyInput = {
  code?: InputMaybe<CurrencyCode>;
  decimalDigits?: InputMaybe<Scalars['Int']['input']>;
  decimalSeparator?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  thousandsSeparator?: InputMaybe<Scalars['String']['input']>;
};

export type CustomAttribute = {
  __typename?: 'CustomAttribute';
  key: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type CustomAttributeInput = {
  key: Scalars['String']['input'];
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Custom Cart Attributes are used for any type of custom data you want to store on a Cart. These are transferred to Orders when you checkout. */
export type CustomCartAttribute = {
  __typename?: 'CustomCartAttribute';
  key: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type DeleteCartInput = {
  /** The ID of the Cart you wish to delete. */
  id: Scalars['ID']['input'];
};

export type DeletePayload = {
  __typename?: 'DeletePayload';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type EmptyCartInput = {
  /** The ID of the Cart you wish to empty. */
  id: Scalars['ID']['input'];
};

export type Human = Being & {
  __typename?: 'Human';
  birth: Scalars['BeforeChristDate']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  occupation?: Maybe<Scalars['String']['output']>;
  paysTaxes: Scalars['Boolean']['output'];
};

/** The Money type is used when describing the Cart and Cart Item unit/line totals. */
export type Money = {
  __typename?: 'Money';
  /** The raw amount in cents/pence */
  amount?: Maybe<Scalars['Int']['output']>;
  /** The current currency details of the money amount */
  currency: Currency;
  /** The formatted amount with the cart currency. */
  formatted: Scalars['String']['output'];
};

export type MortalBeing = Animal | Human;

export type Mutation = {
  __typename?: 'Mutation';
  /** Use this to add items to the cart. If the item already exists, the provided input will be merged and quantity will be increased. */
  addItem: Cart;
  /** Use this to convert a cart to an unpaid order. */
  checkout?: Maybe<Order>;
  /** Use this to decrease the item quantity of the provided item ID. If the item doesn't exist, it'll throw an error. */
  decrementItemQuantity: Cart;
  /** Use this to delete a cart. If the cart doesn't exist, it'll throw an error. */
  deleteCart: DeletePayload;
  /** Use this to empty the cart. If the cart doesn't exist, it'll throw an error. */
  emptyCart: Cart;
  /** Use this to increase the item quantity of the provided item ID. If the item doesn't exist, it'll throw an error. */
  incrementItemQuantity: Cart;
  /** Use this to remove any items from the cart. If it doesn't exist, it'll throw an error. */
  removeItem: Cart;
  /** Use this to set all the items at once in the cart. This will override any existing items. */
  setItems: Cart;
  /** Use this to update the cart currency or metadata. If the cart doesn't exist, it'll throw an error. */
  updateCart: Cart;
  /** Use this to update any existing items in the cart. If the item doesn't exist, it'll return an error. */
  updateItem: Cart;
};


export type MutationAddItemArgs = {
  input: AddToCartInput;
};


export type MutationCheckoutArgs = {
  input: CheckoutInput;
};


export type MutationDecrementItemQuantityArgs = {
  input: UpdateItemQuantityInput;
};


export type MutationDeleteCartArgs = {
  input: DeleteCartInput;
};


export type MutationEmptyCartArgs = {
  input: EmptyCartInput;
};


export type MutationIncrementItemQuantityArgs = {
  input: UpdateItemQuantityInput;
};


export type MutationRemoveItemArgs = {
  input: RemoveCartItemInput;
};


export type MutationSetItemsArgs = {
  input: SetCartItemsInput;
};


export type MutationUpdateCartArgs = {
  input: UpdateCartInput;
};


export type MutationUpdateItemArgs = {
  input: UpdateCartItemInput;
};

export type Node = {
  id: Scalars['ID']['output'];
};

/** Orders are immutable. Once created, you can't change them. The status will automatically reflect the current payment status. */
export type Order = {
  __typename?: 'Order';
  /** The custom attributes set at checkout */
  attributes: Array<CustomAttribute>;
  /** The orders billing address. */
  billing: Address;
  /** The ID of the cart you want to "checkout". */
  cartId: Scalars['ID']['output'];
  /** The date and time the order was created. */
  createdAt: Scalars['Date']['output'];
  /** The email of the recipient. Can be used later for cart recovery emails. */
  email: Scalars['String']['output'];
  /** The grand total for all items, including shipping, including the raw/formatted amounts and currency details. */
  grandTotal: Money;
  id: Scalars['ID']['output'];
  /** The order items that were in the cart. */
  items: Array<OrderItem>;
  /** The metadata set at checkout */
  metadata?: Maybe<Scalars['Json']['output']>;
  /** The notes set at checkout. */
  notes?: Maybe<Scalars['String']['output']>;
  /** The orders shipping address. */
  shipping: Address;
  /** The total for all items with type SHIPPING, including the raw/formatted amounts and currency details. */
  shippingTotal: Money;
  /** The current order status. This will reflect the current payment status. The first stage is 'unpaid'. */
  status: OrderStatus;
  /** Sum of all SKU items, excluding discounts, taxes, shipping, including the raw/formatted amounts and currency details */
  subTotal: Money;
  /** The total for all items with type TAX, including the raw/formatted amounts and currency details. */
  taxTotal: Money;
  /** The total item count. */
  totalItems: Scalars['Int']['output'];
  /** The total unique item count. */
  totalUniqueItems: Scalars['Int']['output'];
  /** The date and time the order status was updated. */
  updatedAt: Scalars['Date']['output'];
};

/**
 * Orders contain items that were converted from the Cart at 'checkout'.
 *
 * Order items are identical to the CartItem type.
 */
export type OrderItem = {
  __typename?: 'OrderItem';
  attributes: Array<CustomCartAttribute>;
  createdAt: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  images?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  lineTotal: Money;
  metadata?: Maybe<Scalars['Json']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Int']['output'];
  type: CartItemType;
  unitTotal: Money;
  updatedAt: Scalars['Date']['output'];
};

export enum OrderStatus {
  Paid = 'PAID',
  Unpaid = 'UNPAID'
}

export type Query = {
  __typename?: 'Query';
  /** Use this to get a cart by a custom ID. If a cart doesn't exist with this ID, it will be created for you. */
  cart?: Maybe<Cart>;
  mortalBeings: Array<MortalBeing>;
  node?: Maybe<Node>;
};


export type QueryCartArgs = {
  currency?: InputMaybe<CurrencyInput>;
  id: Scalars['ID']['input'];
};


export type QueryNodeArgs = {
  currency?: InputMaybe<CurrencyInput>;
  id: Scalars['ID']['input'];
};

export type RemoveCartItemInput = {
  /** The ID of the Cart in which the CartItem belongs to. */
  cartId: Scalars['ID']['input'];
  /** The ID of the CartItem you wish to remove. */
  id: Scalars['ID']['input'];
};

export type SetCartItemInput = {
  attributes?: InputMaybe<Array<InputMaybe<CustomAttributeInput>>>;
  currency?: InputMaybe<CurrencyInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  images?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  metadata?: InputMaybe<Scalars['Json']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Int']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<CartItemType>;
};

export type SetCartItemsInput = {
  cartId: Scalars['ID']['input'];
  items: Array<SetCartItemInput>;
};

export type UpdateCartInput = {
  attributes?: InputMaybe<Array<InputMaybe<CustomAttributeInput>>>;
  currency?: InputMaybe<CurrencyInput>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  metadata?: InputMaybe<Scalars['Json']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCartItemInput = {
  cartId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  images?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  metadata?: InputMaybe<Scalars['Json']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<CartItemType>;
};

export type UpdateItemQuantityInput = {
  /** The amount (as Int) you wish to increment the Cart item quantity by. */
  by: Scalars['Int']['input'];
  /** The ID of the Cart in which the CartItem belongs to. */
  cartId: Scalars['ID']['input'];
  /** The ID of the CartItem you wish to update. */
  id: Scalars['ID']['input'];
};

export type AddItemMutationVariables = Exact<{
  input: AddToCartInput;
}>;


export type AddItemMutation = { __typename?: 'Mutation', addItem: { __typename?: 'Cart', id: string, totalItems?: number | null, items: Array<{ __typename?: 'CartItem', id: string, name?: string | null, quantity: number }> } };

export type GetCartQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCartQuery = { __typename?: 'Query', cart?: { __typename?: 'Cart', id: string, email?: string | null, totalItems?: number | null, isEmpty?: boolean | null, abandoned?: boolean | null, metadata?: any | null, notes?: string | null, createdAt: any, updatedAt: any, subTotal: { __typename?: 'Money', formatted: string, amount?: number | null }, items: Array<{ __typename?: 'CartItem', id: string, name?: string | null, description?: string | null, type: CartItemType, images?: Array<string | null> | null, quantity: number, metadata?: any | null, createdAt: any, updatedAt: any, unitTotal: { __typename?: 'Money', amount?: number | null, formatted: string, currency: { __typename?: 'Currency', code?: CurrencyCode | null, symbol?: string | null, thousandsSeparator?: string | null, decimalSeparator?: string | null, decimalDigits?: number | null } }, lineTotal: { __typename?: 'Money', amount?: number | null }, attributes: Array<{ __typename?: 'CustomCartAttribute', key: string, value?: string | null }> }> } | null };

export type ItemFieldsFragment = { __typename?: 'CartItem', id: string, name?: string | null, description?: string | null, unitTotal: { __typename?: 'Money', amount?: number | null, currency: { __typename?: 'Currency', code?: CurrencyCode | null, symbol?: string | null } } };

export type GetCartWithFragmentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCartWithFragmentQuery = { __typename?: 'Query', cart?: { __typename?: 'Cart', id: string, items: Array<{ __typename?: 'CartItem', id: string, name?: string | null, description?: string | null, unitTotal: { __typename?: 'Money', amount?: number | null, currency: { __typename?: 'Currency', code?: CurrencyCode | null, symbol?: string | null } } }> } | null };

export type CurrencyFragmentFragment = { __typename?: 'Currency', code?: CurrencyCode | null, symbol?: string | null };

export type UnitTotalFragmentFragment = { __typename?: 'Money', amount?: number | null, currency: { __typename?: 'Currency', code?: CurrencyCode | null, symbol?: string | null } };

export type GetCartWithNestedFragmentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCartWithNestedFragmentQuery = { __typename?: 'Query', cart?: { __typename?: 'Cart', items: Array<{ __typename?: 'CartItem', unitTotal: { __typename?: 'Money', amount?: number | null, currency: { __typename?: 'Currency', code?: CurrencyCode | null, symbol?: string | null } } }> } | null };

export type GetAllMortalBeingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllMortalBeingsQuery = { __typename?: 'Query', mortalBeings: Array<{ __typename: 'Animal', id: string, name: string, birth: any, paysTaxes: boolean, species?: string | null } | { __typename: 'Human', id: string, name: string, birth: any, paysTaxes: boolean, occupation?: string | null }> };

export const ItemFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CartItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitTotal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]} as unknown as DocumentNode<ItemFieldsFragment, unknown>;
export const CurrencyFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CurrencyFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Currency"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]} as unknown as DocumentNode<CurrencyFragmentFragment, unknown>;
export const UnitTotalFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UnitTotalFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Money"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CurrencyFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CurrencyFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Currency"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]} as unknown as DocumentNode<UnitTotalFragmentFragment, unknown>;
export const AddItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddToCartInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]}}]} as unknown as DocumentNode<AddItemMutation, AddItemMutationVariables>;
export const GetCartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCart"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cart"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"isEmpty"}},{"kind":"Field","name":{"kind":"Name","value":"abandoned"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formatted"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"unitTotal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"thousandsSeparator"}},{"kind":"Field","name":{"kind":"Name","value":"decimalSeparator"}},{"kind":"Field","name":{"kind":"Name","value":"decimalDigits"}}]}},{"kind":"Field","name":{"kind":"Name","value":"formatted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lineTotal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetCartQuery, GetCartQueryVariables>;
export const GetCartWithFragmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCartWithFragment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cart"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ItemFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CartItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitTotal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]} as unknown as DocumentNode<GetCartWithFragmentQuery, GetCartWithFragmentQueryVariables>;
export const GetCartWithNestedFragmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCartWithNestedFragment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cart"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unitTotal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UnitTotalFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CurrencyFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Currency"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UnitTotalFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Money"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CurrencyFragment"}}]}}]}}]} as unknown as DocumentNode<GetCartWithNestedFragmentQuery, GetCartWithNestedFragmentQueryVariables>;
export const GetAllMortalBeingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllMortalBeings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mortalBeings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Human"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"birth"}},{"kind":"Field","name":{"kind":"Name","value":"paysTaxes"}},{"kind":"Field","name":{"kind":"Name","value":"occupation"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Animal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"birth"}},{"kind":"Field","name":{"kind":"Name","value":"paysTaxes"}},{"kind":"Field","name":{"kind":"Name","value":"species"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllMortalBeingsQuery, GetAllMortalBeingsQueryVariables>;