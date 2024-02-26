# Contributing to CONTRIBUTING.md

First of all, thanks for taking the time to contribute! 😎

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different
ways to help and details about how this project handles them. Please make sure to read the relevant section before
making your contribution. And again, thank you for your time and effort 😇

> And if you like the project, but just don't have time to contribute, that's also fine. There are other easy ways to
> support the project and show your appreciation, such as:
>
> - Starring the project
> - Using this project/tool in your projects
> - Referencing this project in any kind of way.

## Table of Contents

- [Questions](#questions)
- [Contributing](#contributing)
- [Reporting bugs](#reporting-bugs)
- [Suggesting enhancements](#suggesting-enhancements)

## Questions

Before you ask a question, it is best to search for existing [Issues](/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

I will then try my best to resolve the issue as soon as possible 🤙

## Contributing

#### How can I create a new package?

As you can see, the project is structured as a monorepo using [Nx](https://nx.dev/). To create a new package:

```bash
nx g @nx/js:lib --directory=packages/my-package --name=my-package --tags=scope:@mocking-bird --importPath=@mocking-bird
```

Just replace `my-package` with the name of your package. This will create a new package in the `packages` directory.

After that, `nx` will prompt you to select the test runner and which bundler you want to use. In this project, we
use `jest` and `tsc` respectively.

#### How can I contribute to an existing package?

If you want to contribute to an existing package, you can do so by following these guidelines:

- Create a new pull request which follows the guideline in the [Pull Request Template](/.github/PULL_REQUEST_TEMPLATE.md).
- Make sure to follow the [commit message convention](https://www.conventionalcommits.org/en/v1.0.0/). The title of
  the PR also follows the same convention. For example:
  - `feat(mongoose): add new feature`
  - `fix(core): fix a bug`
  - `docs(mongoose): fix typo`
- Make sure to include tests for the new feature or the bug fix.
- Add necessary comments for new classes and methods.
- Write or improve documentations if necessary.
- Link to the GitHub issue that the PR is addressing.

## Reporting Bugs

#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side, e.g., using incompatible versions of the peer
  dependencies.
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if
  there is already a similar bug report.
- Stack trace (Traceback)
- Possibly your input and the output

## Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for CONTRIBUTING.md,
**including completely new features and minor improvements to existing functionality**.
Following these guidelines will help maintainers and the community to understand your suggestion and find related
suggestions.

#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the documentations of the corresponding sub-projects carefully and find out if the functionality is already
  covered.
- Perform a [search](/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- **Explain why this enhancement would be useful** to most CONTRIBUTING.md users. You may also want to point out
  other projects that solved it better and which could serve as an inspiration.
