# Mocking Bird

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)

Testing with real-world data scenarios is crucial, but creating such data shouldn't be a chore. _The Mocking Bird
Project_ aims to provide a simple and easy, yet accurate and context-aware data generation for your models or
schemas, so that it makes your testing experience smooth. Whether it be unit tests, integration tests or stress
tests, you can easily generate fake data with custom options and constraints.

What does it mean to be context-aware? It means that the generated data is not just random-random value, but it's
generated in a way that it's suitable for the fields and constraints of your model or schema. For example, if you have a field
`workEmail` in your model, the generated data will be a valid email address, and not just a random string.

# Table of contents

- [Packages](#packages)
- [Running tests](#running-tests)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

# Packages

Mocking Bird is a package-based repo using [Nx](https://nx.dev/). To see how individual packages work, please refer to the respective READMEs.

- [@mocking-bird/core](./packages/core/README.md)
- [@mocking-bird/mongoose](./packages/mongoose/README.md)

To contribute to the project with a new package, please refer to the [contribution guidelines](CONTRIBUTING.md).

# Running tests

Depending on which directory you are in, you can run the tests for the respective package.

`npm run test`

In the root directory, it will run the tests for only affected packages.

Alternatively, you could directly use `nx` to run the tests.

```
nx affected -t test --parallel
nx run-many --target=test --all
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
