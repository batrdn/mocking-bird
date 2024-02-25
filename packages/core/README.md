# Core

> Not installed as a package, but instead used as a base for other packages.

The core module contains the abstract class definitions and overall the base functionalities used for fixture 
generations. New packages may extend the core module to create their own fixture generation logic.

## Main Components

- `CoreFixture` - The abstract class that defines the main functionalities for fixture generation.
- `PathFinder` - The abstract class that defines the logic for resolving field paths.
- `CoreTypeMapper` - The abstract class that defines the logic for mapping types to fixture generation.
- `FakerApi` - A class that abstracts the logic generating fake data. It uses the `faker.js` library under the hood.
- `FakerFinder` - A class that resolves the `faker` method for a given field name using fuzzy search.
