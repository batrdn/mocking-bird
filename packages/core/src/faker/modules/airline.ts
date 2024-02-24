import { FakerCandidate, FieldType, Rule } from '../../types';
import { faker } from '@faker-js/faker';
import { FakerHelpers } from '../faker-helpers';
import { BaseFakerModule } from './base-faker-module';

export class AirlineModule extends BaseFakerModule {
  private flightNumber(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'flightNumber',
      callback: (rule: Rule | undefined) => {
        const { min, max } = FakerHelpers.getMinMaxRule(rule);

        if (min !== undefined && max !== undefined) {
          return faker.airline.flightNumber({
            length: {
              min,
              max,
            },
          });
        }

        return faker.airline.flightNumber(
          rule?.size ? { length: rule.size } : undefined
        );
      },
    };
  }

  private aircraftType(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'aircraftType',
      callback: () => {
        return faker.airline.aircraftType();
      },
    };
  }

  private seat(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'seat',
      callback: () => {
        return faker.airline.seat();
      },
    };
  }

  private airline(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'airline',
      callback: () => {
        return faker.airline.airline().name;
      },
    };
  }

  private airport(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'airport',
      callback: () => {
        return faker.airline.airport().name;
      },
    };
  }

  private airplane(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'airplane',
      callback: () => {
        return faker.airline.airplane().name;
      },
    };
  }

  private recordLocator(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'recordLocator',
      callback: () => {
        return faker.airline.recordLocator();
      },
    };
  }

  override toFakerCandidates(): FakerCandidate[] {
    return [
      this.flightNumber(),
      this.aircraftType(),
      this.seat(),
      this.airline(),
      this.airport(),
      this.airplane(),
      this.recordLocator(),
    ];
  }
}
