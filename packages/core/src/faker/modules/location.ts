import { AbstractFakerModule } from './abstract-faker-module';
import { FakerCandidate } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';
import { FakerHelpers } from '../faker-helpers';

export class LocationModule extends AbstractFakerModule {
  private zipCode(): FakerCandidate {
    return {
      method: 'zipCode',
      callback: (rule) => faker.location.zipCode(),
    };
  }

  private city(): FakerCandidate {
    return {
      method: 'city',
      callback: () => faker.location.city(),
    };
  }

  private buildingNumber(): FakerCandidate {
    return {
      method: 'buildingNumber',
      callback: () => faker.location.buildingNumber(),
    };
  }

  private street(): FakerCandidate {
    return {
      method: 'street',
      callback: () => faker.location.street(),
    };
  }

  private streetAddress(): FakerCandidate {
    return {
      method: 'streetAddress',
      callback: () => faker.location.streetAddress(),
    };
  }

  private country(): FakerCandidate {
    return {
      method: 'country',
      callback: () => faker.location.country(),
    };
  }

  private countryCode(): FakerCandidate {
    return {
      method: 'countryCode',
      callback: () => faker.location.countryCode(),
    };
  }

  private state(): FakerCandidate {
    return {
      method: 'state',
      callback: () => faker.location.state(),
    };
  }

  private latitude(): FakerCandidate {
    return {
      method: 'latitude',
      callback: (rule) =>
        faker.location.latitude(FakerHelpers.getMinMaxRule(rule)),
    };
  }

  private longitude(): FakerCandidate {
    return {
      method: 'longitude',
      callback: (rule) =>
        faker.location.longitude(FakerHelpers.getMinMaxRule(rule)),
    };
  }

  private direction(): FakerCandidate {
    return {
      method: 'direction',
      callback: () => faker.location.direction(),
    };
  }

  private cardinalDirection(): FakerCandidate {
    return {
      method: 'cardinalDirection',
      callback: () => faker.location.cardinalDirection(),
    };
  }

  private ordinalDirection(): FakerCandidate {
    return {
      method: 'ordinalDirection',
      callback: () => faker.location.ordinalDirection(),
    };
  }

  private nearbyGPSCoordinate(): FakerCandidate {
    return {
      method: 'nearbyGPSCoordinate',
      callback: () => faker.location.nearbyGPSCoordinate(),
    };
  }

  private timeZone(): FakerCandidate {
    return {
      method: 'timeZone',
      callback: () => faker.location.timeZone(),
    };
  }

  toFakerCandidates(): FakerCandidate[] {
    return [
      this.zipCode(),
      this.city(),
      this.buildingNumber(),
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
      this.nearbyGPSCoordinate(),
      this.timeZone(),
    ];
  }
}
