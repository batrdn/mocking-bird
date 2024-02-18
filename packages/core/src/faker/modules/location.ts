import { AbstractFakerModule } from './abstract-faker-module';
import { FakerCandidate, FieldType } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';
import { FakerHelpers } from '../faker-helpers';

export class LocationModule extends AbstractFakerModule {
  private zipCode(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'zipCode',
      callback: () => faker.location.zipCode(),
    };
  }

  private city(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'city',
      callback: () => faker.location.city(),
    };
  }

  private buildingNumber(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'buildingNumber',
      callback: () => faker.location.buildingNumber(),
    };
  }

  private buildingNumberInt(): FakerCandidate {
    return {
      type: FieldType.NUMBER,
      method: 'buildingNumber',
      callback: () => this.convertToInt(faker.location.buildingNumber()),
    };
  }

  private street(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'street',
      callback: () => faker.location.street(),
    };
  }

  private streetAddress(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'streetAddress',
      callback: () => faker.location.streetAddress(),
    };
  }

  private country(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'country',
      callback: () => faker.location.country(),
    };
  }

  private countryCode(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'countryCode',
      callback: () => faker.location.countryCode(),
    };
  }

  private state(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'state',
      callback: () => faker.location.state(),
    };
  }

  private latitude(): FakerCandidate {
    return {
      type: FieldType.NUMBER,
      method: 'latitude',
      callback: (rule) =>
        faker.location.latitude(FakerHelpers.getMinMaxRule(rule)),
    };
  }

  private longitude(): FakerCandidate {
    return {
      type: FieldType.NUMBER,
      method: 'longitude',
      callback: (rule) =>
        faker.location.longitude(FakerHelpers.getMinMaxRule(rule)),
    };
  }

  private direction(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'direction',
      callback: () => faker.location.direction(),
    };
  }

  private cardinalDirection(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'cardinalDirection',
      callback: () => faker.location.cardinalDirection(),
    };
  }

  private ordinalDirection(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'ordinalDirection',
      callback: () => faker.location.ordinalDirection(),
    };
  }

  private timeZone(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'timeZone',
      callback: () => faker.location.timeZone(),
    };
  }

  toFakerCandidates(): FakerCandidate[] {
    return [
      this.zipCode(),
      this.city(),
      this.buildingNumber(),
      this.buildingNumberInt(),
      this.street(),
      this.streetAddress(),
      this.country(),
      this.countryCode(),
      this.state(),
      this.latitude(),
      this.longitude(),
      this.direction(),
      this.cardinalDirection(),
      this.ordinalDirection(),
      this.timeZone(),
    ];
  }
}
