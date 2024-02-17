import { FakerCandidate } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';
import { FakerHelpers } from '../faker-helpers';
import { AbstractFakerModule } from './abstract-faker-module';

export class AirlineModule extends AbstractFakerModule {
  private flightNumber(): FakerCandidate {
    return {
      method: 'flightNumber',
      callback: (rule) => {
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
      method: 'aircraftType',
      callback: (rule) => {
        return faker.airline.aircraftType();
      },
    };
  }

  private seat(): FakerCandidate {
    return {
      method: 'seat',
      callback: (rule) => {
        return faker.airline.seat();
      },
    };
  }

  private airline(): FakerCandidate {
    return {
      method: 'airline',
      callback: (rule) => {
        return faker.airline.airline();
      },
    };
  }

  private airport(): FakerCandidate {
    return {
      method: 'airport',
      callback: (rule) => {
        return faker.airline.airport();
      },
    };
  }

  private airplane(): FakerCandidate {
    return {
      method: 'airplane',
      callback: (rule) => {
        return faker.airline.airplane();
      },
    };
  }

  private recordLocator(): FakerCandidate {
    return {
      method: 'recordLocator',
      callback: (rule) => {
        return faker.airline.recordLocator();
      },
    };
  }

  toFakerCandidates(): FakerCandidate[] {
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
