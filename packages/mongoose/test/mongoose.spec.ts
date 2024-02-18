import { MongooseFixture } from '../src';
import { NestedModel, BasicModel, IBasicDocument } from './models';

describe('Mocking Bird - Mongoose', () => {
  const assertRequiredFields = (mock: IBasicDocument) => {
    // Required fields should be defined
    expect(mock.firstname).toBeDefined();
    expect(mock.lastname).toBeDefined();
    expect(mock.date).toBeDefined();

    // Non-required fields should be undefined
    expect(mock.age).toBeUndefined();
    expect(mock.email).toBeUndefined();
    expect(mock.binData).toBeUndefined();
    expect(mock.idField).toBeUndefined();
    expect(mock.uuid).toBeUndefined();
    expect(mock.bigInt).toBeUndefined();
    expect(mock.decimal128).toBeUndefined();
    expect(mock.array).toBeUndefined();
    expect(mock.enum).toBeUndefined();
  };

  describe('Basic model', () => {
    const fixture = new MongooseFixture(BasicModel);

    it('should generate a basic model mock', () => {
      const mock = fixture.generate();

      expect(mock).toBeDefined();

      // Check the basic types
      expect(typeof mock.firstname).toBe('string');
      expect(typeof mock.age).toBe('number');
      expect(typeof mock.isDefault).toBe('boolean');
      expect(typeof mock.idField).toBe('string');
      expect(typeof mock.uuid).toBe('string');
      expect(typeof mock.bigInt).toBe('bigint');
      expect(typeof mock.decimal128).toBe('number');

      expect(mock.date).toBeInstanceOf(Date);
      expect(mock.array).toBeInstanceOf(Array<string>);
      expect(mock.binData).toBeInstanceOf(Buffer);
    });

    it('should override field value', () => {
      const { firstname, age } = fixture.generate({
        firstname: 'John',
        age: 20,
      });

      expect(firstname).toBe('John');
      expect(age).toBe(20);
    });

    it('should create a mock based on schema rules', () => {
      const mock = fixture.generate();

      expect(mock.age).toBeGreaterThanOrEqual(18);
      expect(mock.age).toBeLessThanOrEqual(99);

      expect(mock.enum).toMatch(/A|B|C/);
    });

    it('should create a mock within the specified number range', () => {
      const mock = fixture.generate(
        {},
        {
          rules: [
            {
              path: 'array',
              size: 5,
            },
            {
              path: 'age',
              min: 25,
              max: 30,
            },
          ],
        }
      );

      expect(mock.array).toHaveLength(5);
      expect(mock.age).toBeGreaterThanOrEqual(25);
      expect(mock.age).toBeLessThanOrEqual(30);
    });

    it('should create a mock based on regex pattern', () => {
      const mock = fixture.generate(
        {},
        {
          rules: [
            {
              path: 'firstname',
              pattern: /ABC*DE/,
            },
          ],
        }
      );

      expect(mock.firstname).toMatch(/ABC*DE/);
    });

    it('should create a mock based on enum', () => {
      const mock = fixture.generate(
        {},
        {
          rules: [
            {
              path: 'firstname',
              enum: ['John', 'Doe'],
            },
          ],
        }
      );

      expect(mock.firstname).toMatch(/John|Doe/);
    });

    it('should generate only required fields', () => {
      const mock = fixture.generate({}, { requiredOnly: true });

      assertRequiredFields(mock);
    });

    it('should exclude specified fields', () => {
      const mock = fixture.generate({}, { exclude: ['age', 'email'] });

      expect(mock.age).toBeUndefined();
      expect(mock.email).toBeUndefined();
    });

    it('should override schema rule and use custom if there is no conflict', () => {
      const mock = fixture.generate(
        {},
        {
          rules: [
            {
              path: 'age',
              min: 20, // schema definition is min: 18
              max: 22, // schema definition is max: 99
            },
          ],
        }
      );

      expect(mock.age).toBeGreaterThanOrEqual(20);
      expect(mock.age).toBeLessThanOrEqual(22);
    });

    it('should throw an error if a required field is excluded', () => {
      expect(() => {
        fixture.generate({}, { exclude: ['firstname'] });
      }).toThrow('Cannot exclude required field: firstname');
    });

    it('should throw an error if override value is incompatible to schema rule', () => {
      expect(() => {
        fixture.generate({ age: 100 });
      }).toThrow("Validation failed for field 'age': 100");

      expect(() => {
        fixture.generate({ enum: 'D' });
      }).toThrow("Validation failed for field 'enum': D");
    });

    it('should throw an error if invalid data type is provided for a field', () => {
      expect(() => {
        fixture.generate({ age: false });
      }).toThrow("Validation failed for field 'age': false");

      expect(() => {
        fixture.generate({ firstname: 100 });
      }).toThrow("Validation failed for field 'firstname': 100");
    });
  });

  describe('Schema & Custom Rules Conflict', () => {
    const fixture = new MongooseFixture(BasicModel);

    it('should throw an error if required field has conflict', () => {
      expect(() => {
        fixture.generate(
          {},
          {
            rules: [
              {
                path: 'firstname',
                required: false,
              },
            ],
          }
        );
      }).toThrow(
        'Forbidden: required field cannot be overridden to be non-required'
      );
    });

    it('should throw an error if minimum value has conflict', () => {
      expect(() => {
        fixture.generate(
          {},
          {
            rules: [
              {
                path: 'age',
                min: 10,
              },
            ],
          }
        );
      }).toThrow(
        'Forbidden: min value cannot be overridden to be less than the schema min value'
      );
    });

    it('should throw an error if maximum value has conflict', () => {
      expect(() => {
        fixture.generate(
          {},
          {
            rules: [
              {
                path: 'age',
                max: 100,
              },
            ],
          }
        );
      }).toThrow(
        'Forbidden: max value cannot be overridden to be greater than the schema max value'
      );
    });

    it('should throw an error if enum values have conflict', () => {
      expect(() => {
        fixture.generate(
          {},
          {
            rules: [
              {
                path: 'enum',
                enum: ['D', 'E'],
              },
            ],
          }
        );
      }).toThrow(
        'Forbidden: enum values cannot be overridden to include values not in the schema enum: D, E'
      );
    });

    it('should throw an error if max value is less than the schema min value', () => {
      expect(() => {
        fixture.generate(
          {},
          {
            rules: [
              {
                path: 'age',
                max: 1,
              },
            ],
          }
        );
      }).toThrow('Max 1 should be greater than min 18.');
    });

    it('should throw an error if min value is greater than the schema max value', () => {
      expect(() => {
        fixture.generate(
          {},
          {
            rules: [
              {
                path: 'age',
                min: 100,
              },
            ],
          }
        );
      }).toThrow('Max 99 should be greater than min 100.');
    });
  });

  describe('Nested model', () => {
    const fixture = new MongooseFixture(NestedModel);

    it('should generate a nested model mock', () => {
      const { complexObject, mixedType } = fixture.generate();

      expect(typeof complexObject.child.name).toBe('string');
      expect(typeof complexObject.child.isChild).toBe('boolean');
      expect(complexObject.child.values).toBeInstanceOf(Array<number>);
      expect(complexObject.children).toHaveLength(1);

      expect(mixedType.mixedAnyObject).toBeDefined();
      expect(mixedType.mixedArray).toHaveLength(1);
    });

    it('should override nested field value', () => {
      const mock = fixture.generate({
        'complexObject.child.name': 'John',
        'complexObject.child.values': [1, 2, 3],
        'mixedType.mixedAnyObject': 'Hello',
        'mixedType.mixedArray': ['World'],
      });

      expect(mock.complexObject.child.name).toBe('John');
      expect(mock.complexObject.child.values).toEqual([1, 2, 3]);
      expect(mock.mixedType.mixedAnyObject).toBe('Hello');
      expect(mock.mixedType.mixedArray).toEqual(['World']);
    });

    it('should override based on glob pattern', () => {
      const { complexObject } = fixture.generate({
        'complexObject.*.name': 'John',
      });

      expect(complexObject.child.name).toBe('John');
      expect(complexObject.children.every((c) => c.name === 'John')).toBe(true);
    });

    it('should override based on complex glob pattern', () => {
      const { complexObject } = fixture.generate({
        'complexObject.**.is*': true, // ? is a wildcard that matches by characters
      });

      expect(complexObject.child.isNested).toBe(true);
      expect(complexObject.child.isChild).toBe(true);

      // Values should be overridden based on the double wildcard (**) glob pattern
      expect(complexObject.children.every((c) => c.isNested)).toBe(true);
      expect(complexObject.children.every((c) => c.isChild)).toBe(true);
    });

    it('should generate values based on custom rules with glob pattern', () => {
      const mock = fixture.generate(
        {},
        {
          rules: [
            {
              path: 'complexObject.*.values',
              size: 5,
            },
          ],
        }
      );

      const { child, children } = mock.complexObject;

      expect(child.values).toHaveLength(5);
      expect(children.every((c) => c.values.length === 5)).toBe(true);
    });

    it('should ignore non-existing fields', () => {
      const { complexObject } = fixture.generate({
        complexObject: {
          child: {
            email: 'email@example.com',
          },
        },
      });

      expect(complexObject.child.hasOwnProperty('email')).toBe(false);
    });

    it('should ignore or throw an error for invalid glob pattern syntax', () => {
      expect(() => {
        fixture.generate({
          'complexObject.[].name': 'John',
        });
      }).toThrow();

      expect(() => {
        fixture.generate({
          'complexObject.$.name': 'John',
        });
      }).toThrow();
    });

    it('should throw an error if there is a conflicting glob pattern in override values', () => {
      expect(() => {
        fixture.generate({
          'complexObject.*.name': 'John',
          'complexObject.**.name': 'Doe',
        });
      }).toThrow();

      expect(() => {
        fixture.generate({
          'complexObject.child.name': 'John',
          'complexObject.*.name': 'Doe',
        });
      }).toThrow();
    });

    it('should throw an error if there is a conflicting glob pattern in custom rules', () => {
      expect(() => {
        fixture.generate(
          {},
          {
            rules: [
              {
                path: 'complexObject.*.name',
                pattern: /John|Doe/,
              },
              {
                path: 'complexObject.child.name',
                size: 10,
              },
            ],
          }
        );
      }).toThrow();
    });
  });

  describe('Bulk generation', () => {
    it('should generate multiple mocks', () => {
      const basicFixture = new MongooseFixture(BasicModel);
      const basicMocks = basicFixture.bulkGenerate(5);

      const nestedFixture = new MongooseFixture(NestedModel);
      const nestedMocks = nestedFixture.bulkGenerate(10);

      expect(basicMocks).toHaveLength(5);
      expect(nestedMocks).toHaveLength(10);
    });
  });

  describe('Global options', () => {
    beforeEach(() => {
      MongooseFixture.setGlobalOptions({
        requiredOnly: true,
      });
    });

    afterEach(() => {
      MongooseFixture.setGlobalOptions({});
    });

    it('should generate mocks based on global options', () => {
      const fixture = new MongooseFixture(BasicModel);
      const mock = fixture.generate();

      assertRequiredFields(mock);
    });

    it('should override global options', () => {
      const fixture = new MongooseFixture(BasicModel);
      const mock = fixture.generate({}, { requiredOnly: false });

      expect(mock.age).toBeDefined();
      expect(mock.email).toBeDefined();
    });
  });
});
