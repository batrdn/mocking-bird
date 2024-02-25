# Mongoose Fixture

Generates fixtures for `mongoose`. Simply provide the schema or model, and it will generate mock data
based on the types and constraints of the schema.

# Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Accurate data generation](#accurate-data-generation)
- [Options](#options)
- [Resolving paths](#resolving-paths)
- [Overriding values](#overriding-values)
- [Schema rules](#schema-rules)

# Installation

```sh
npm i -D @mocking-bird/mongoose
```

# Usage

```typescript
import { Schema } from 'mongoose';
import { MongooseFixture } from '@mocking-bird/mongoose';

const schema = new Schema({
  name: String,
  email: String,
  age: { type: Number, min: 18, max: 100 },
  workEmail: String,
  address: {
    street: String,
    city: String,
    country: String,
  },
  createdAt: Date,
  updatedAt: Date,
});

const fixture = new MongooseFixture(schema);

const data = fixture.generate();
```

**Example output:**

```json
{
  "name": "Turner, Thompson and Mueller",
  "email": "Jerome.Mraz58@yahoo.com",
  "age": 55,
  "workEmail": "Sabrina99@hotmail.com",
  "address": {
    "street": "Apt. 123 1234",
    "city": "Lake Ethylburgh",
    "country": "Gambia"
  },
  "createdAt": "2023-09-11T05:38:59.576Z",
  "updatedAt": "2024-02-26T08:25:16.412Z",
  "_id": "a84f58e2fcff9dfaf148d7bf"
}
```

### Bulk generation

```typescript
const data = fixture.bulkGenerate(1000);
```

# Accurate data generation

[(Back to top)](#table-of-contents)

Generated data are not only random-random but also contextually accurate based on field names and types. It leverages
the fuzzy search, or formally, approximate string search algorithm to search for the suitable `faker` to generate
realistic data that relate to the field.

For example:

- `workEmail` -> `Jerome.Mraz58@yahoo.com`
- `employeePhoneNumber` -> `550-459-6013`
- `uploadedFileName` -> `file-1234.pdf`

Of course, there are still some limitations when it comes to complex field names with multiple parts, in which case
the default `fakers` are applied. The default `fakers` are fallbacks in case the fuzzy search score is not high
enough. The default `fakers` may return, depending on the field type, a random string, number, or date, and so on.

# Options

[(Back to top)](#table-of-contents)

### FixtureOptions

| name               | type          | default     | description                                                 |
| ------------------ | ------------- | ----------- | ----------------------------------------------------------- |
| **`rules`**        | `Rule[]`      | `undefined` | Custom rules to apply for fixture generation                |
| **`exclude`**      | `FieldPath[]` | `undefined` | Fields to exclude from fixture generation                   |
| **`requiredOnly`** | `boolean`     | `false`     | Whether to generate only the required fields or not         |
| **`isAccurate`**   | `boolean`     | `true`      | Should employ accurate data generation based on field names |

### Rule

| name           | type                   | isRequired | description                                                                                |
| -------------- | ---------------------- | ---------- | ------------------------------------------------------------------------------------------ |
| **`path`**     | `FieldPath`            | `true`     | The path to the field, for which the rule applies                                          |
| **`required`** | `boolean`              | `false`    | Is the field required or not                                                               |
| **`size`**     | `number`               | `false`    | The size of the generated value, which may apply to arrays, strings or numbers             |
| **`min`**      | `number`               | `false`    | The min value of the generated value. For arrays or strings the minimum size.              |
| **`max`**      | `number`               | `false`    | The max value of the generated value. For arrays or string the maximum size.               |
| **`enum`**     | `string[]`, `number[]` | `false`    | The enum to apply for the generated value                                                  |
| **`pattern`**  | `RegExp`               | `false`    | The pattern to apply for the generated value. The generated value will adhere to the regex |

### FieldPath

> `FieldPath` is a string that represents the path of a field in the schema. It can be a nested path, such as
> `address.street`. It can also be a wildcard path, such as `address.*`, which means all fields under `address`.

### Example

```typescript
fixture.generate(
  {},
  {
    exclude: ['createdAt', 'updatedAt'],
    isAccurate: false,
    requiredOnly: true,
    rules: [
      {
        path: 'address.city',
        enum: ['Berlin', 'Frankfurt'],
      },
      {
        path: 'age',
        min: 18,
        max: 60,
      },
      {
        path: 'workEmail',
        pattern: /@gmail.com$/,
      },
    ],
  },
);
```

### Global Options

You can also set global options for all fixtures:

```typescript
MongooseFixture.setGlobalOptions({
  isAccurate: false,
  requiredOnly: true,
});
```

# Resolving paths

[(Back to top)](#table-of-contents)

When working with nested data structures, you may want to resolve the paths to the fields. This is especially useful
when you want to exclude or apply rules to fields that are nested.

```typescript
fixture.generate({}, { exclude: ['address.city'] });
```

You can also use wildcard paths to exclude or apply rules to all fields under a certain path:

```typescript
fixture.generate({}, { exclude: ['address.*'] });

fixture.generate({
  'person.*.jobTitle': 'Software Engineer',
});

fixture.generate({
  'person.**.is*': true,
}); // will override every field that starts with `is` to true, e.g., isDefault, isCool etc...
```

# Overriding values

[(Back to top)](#table-of-contents)

You can override the generated values by providing a map of values to override:

```typescript
fixture.generate({
  name: 'John Doe',
  email: 'test@example.com',
  age: 25,
});

// or using wildcards

fixture.generate({
  'address.**.buildingNo': '1234',
});
```

# Schema rules

[(Back to top)](#table-of-contents)

The generated values comply with the schema rules, for example:

```typescript
const schema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, min: 18, max: 100 },
  city: { type: String, enum: ['Berlin', 'Frankfurt'] },
});
```

In this case, the `age` will be a number between 18 and 100, and the `city` will be either `Berlin` or `Frankfurt`.

| 🚧 IMPORTANT                                                                                                                                                            |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| If you specify a custom rule, make sure it doesn't conflict with the schema rule. For example, in the example above, you cannot set the `name` field to be not required |

**Limitation**

> There is a limitation when it comes to custom schema validators. In the below example, the generated value cannot
> comply with the custom validator, as it's a function.

```typescript
const schema = new Schema({
  name: {
    type: String,
    validate: {
      validator: (v) => v.length > 5,
      message: 'Name must be longer than 5 characters',
    },
  },
});
```

Alternatively, you can define the same schema validator as a custom rule:

```typescript
fixture.generate(schema, {
  rules: [
    {
      path: 'name',
      min: 6,
    },
  ],
});
```
