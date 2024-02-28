# Mocking Bird

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)

Testing with real-world data scenarios is crucial, but creating such data shouldn't be a chore. Therefore, this project
aims to provide a simple and easy, yet accurate and context-aware data generation for your models or
schemas, so that it makes your testing experience smooth. Whether it is for unit tests, integration tests or stress
tests, you can use it to easily generate fake data with flexible custom options and constraints.

What does it mean to be context-aware? It means that the generated data is not just some random-random value, but it's
generated in a way that it's suitable for the fields and constraints of your model or schema.

For example, if you have a field
`workEmail` in your model, the generated data will be a valid email address, and not just a random string.

# Example

### Mongoose Fixture

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

# Packages

Mocking Bird is a package-based repo using [Nx](https://nx.dev/). At the moment, only `mongoose` fixture generations
are supported. To see how individual packages work in detail, please refer to the respective READMEs.

- [@mocking-bird/core](./packages/core)
- [@mocking-bird/mongoose](./packages/mongoose/README.md)

To contribute to the project with a new package, please refer to the [contribution guidelines](CONTRIBUTING.md).

# Running tests

Depending on which directory you are in, you can run the tests for the respective package.

`npm run test`

In the root directory, it will run the tests for only affected packages.

Alternatively, you could directly use `nx` to run the tests.

```
npx nx affected -t test --parallel
npx nx run-many --target=test --all
```

# Roadmap

- [x] Core fixture generation
- [x] Mongoose fixture generation
- [ ] GraphQL fixture generation
- [ ] Mikro ORM fixture generation
- [ ] Optimize performance for massive data generation
- [ ] Locale support

# Contributing

This project is relatively new, and your contributions are most definitely welcome 🤙!
To contribute to the project, please refer to the [contribution guidelines](CONTRIBUTING.md).

# License

The MIT License (MIT) 2024 - [Bat-Erdene Tsogoo](https://github.com/batrdn). Please have a look at the
[LICENSE](LICENSE.md) for more details.
