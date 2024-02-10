import { MongooseFixture } from '../src';
import { NestedModel, BasicModel } from './models';
import { Schema } from 'mongoose';

describe('Mocking Bird - Mongoose', () => {
  describe('Basic model', () => {
    const fixture = new MongooseFixture(BasicModel);

    it('should generate a basic model mock (primitive type check)', () => {
      const mock = fixture.generate();

      expect(mock).toBeDefined();

      // Check the basic types
      expect(typeof mock.firstname).toBe('string');
      expect(typeof mock.age).toBe('number');
      expect(typeof mock.isDefault).toBe('boolean');
    });

    it('should generate a basic model mock (instance type check)', () => {
      const mock = fixture.generate();

      // Check the instance types
      expect(mock.date).toBeInstanceOf(Date);
      expect(mock.binData).toBeInstanceOf(Buffer);
      expect(mock.idField).toBeInstanceOf(Schema.Types.ObjectId);
      expect(mock.uuid).toBeInstanceOf(Schema.Types.UUID);
      expect(mock.bigInt).toBeInstanceOf(Schema.Types.BigInt);
      expect(mock.decimal128).toBeInstanceOf(Schema.Types.Decimal128);
      expect(mock.array).toBeInstanceOf(Array<string>);
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
      expect(mock.firstname).toMatch(/^[A-Z]/);
      expect(mock.customValidation).toBeLessThan(3);
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
              path: 'enum',
              pattern: /A|B/,
            },
            {
              path: 'firstname',
              // starts with 'J'
              pattern: /^[J]/,
            },
          ],
        }
      );

      expect(mock.enum).toMatch(/A|B/);
      expect(mock.firstname).toMatch(/^[J]/);
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
      expect(mock.customValidation).toBeUndefined();
    });

    it('should exclude specified fields', () => {
      const mock = fixture.generate({}, { exclude: ['age', 'email'] });

      expect(mock.age).toBeUndefined();
      expect(mock.email).toBeUndefined();
    });

    it('should throw an error if a required field is excluded', () => {
      expect(() => {
        fixture.generate({}, { exclude: ['firstname'] });
      }).toThrow('Cannot exclude required field: firstname');
    });

    it('should throw an error if custom rule is incompatible to schema rule', () => {
      expect(() => {
        fixture.generate({}, { rules: [{ path: 'age', min: 100 }] });
      }).toThrow();
    });

    it('should throw an error if override value is incompatible to schema rule', () => {
      expect(() => {
        fixture.generate({ age: 100 });
      }).toThrow();
    });

    it('should throw an error if invalid data type is provided for a field', () => {
      expect(() => {
        fixture.generate({ age: '100' });
      }).toThrow();

      expect(() => {
        fixture.generate({ firstname: 100 });
      }).toThrow();
    });
  });

  describe('Nested model', () => {
    const fixture = new MongooseFixture(NestedModel);

    it('should generate a nested model mock', () => {
      const { complexObject, mixedType } = fixture.generate();

      expect(typeof complexObject.child.name).toBe('string');
      expect(typeof complexObject.child.isNested).toBe('boolean');
      expect(complexObject.child.values).toBeInstanceOf(Array<number>);
      expect(complexObject.children).toHaveLength(1);

      expect(mixedType.mixedAnyObject).toBeDefined();
      expect(mixedType.mixedArray).toHaveLength(1);
    });

    it('should override nested field value', () => {
      const mock = fixture.generate({
        'complexObject.child.name': 'John',
        foo: {
          values: [1, 2, 3],
        },
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
      // False because the wildcard (*) will override an immediate child only. Children is an array, so it will not be
      // overridden.
      expect(complexObject.children.every((c) => c.name === 'John')).toBe(
        false
      );
    });

    it('should override based on complex glob pattern', () => {
      const { complexObject } = fixture.generate({
        'complexObject.**.is?': true, // ? is a wildcard that matches by characters
      });

      expect(complexObject.child.isNested).toBe(true);
      expect(complexObject.child.isChild).toBe(true);

      // Values should be overridden based on the double wildcard (**) glob pattern
      expect(complexObject.children.every((c) => c.isNested)).toBe(true);
      expect(complexObject.children.every((c) => c.isChild)).toBe(true);
    });

    it('should override based on glob pattern with array index', () => {
      const { complexObject } = fixture.generate(
        {
          'complexObject.*.values.1': 100,
        },
        {
          rules: [
            {
              path: 'complexObject.**.values',
              size: 3,
            },
          ],
        }
      );

      expect(complexObject.child.values).toHaveLength(3);
      expect(complexObject.child.values[1]).toBe(100);
      expect(complexObject.children.every((c) => c.values.length === 3)).toBe(
        true
      );
      // Likewise with the wildcard (*) pattern, it will only override the immediate child. In this case it's not valid
      expect(complexObject.children.every((c) => c.values[1] === 100)).toBe(
        false
      );
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
            {
              path: 'complexObject.**.values.0',
              min: 10,
              max: 20,
            },
          ],
        }
      );

      const { child, children } = mock.complexObject;

      expect(child.values).toHaveLength(5);
      expect(children.every((c) => c.values.length === 5)).toBe(false);

      expect(child.values[0]).toBeGreaterThanOrEqual(10);
      expect(child.values[0]).toBeLessThanOrEqual(20);

      expect(children.every((c) => c.values[0] >= 10)).toBe(true);
      expect(children.every((c) => c.values[0] <= 20)).toBe(true);
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

      expect(() => {
        fixture.generate({
          'complexObject.***.name': 'John',
        });
      }).toThrow();
    });

    it('should throw an error if there is a conflicting glob pattern', () => {
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
  });
});
