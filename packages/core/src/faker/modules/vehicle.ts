import { AbstractFakerModule } from './abstract-faker-module';
import {FakerCandidate, FieldType} from '@mocking-bird/core';
import { faker } from '@faker-js/faker';

export class VehicleModule extends AbstractFakerModule {
  private vehicle(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'vehicle',
      callback: () => faker.vehicle.vehicle(),
    };
  }

  private manufacturer(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'manufacturer',
      callback: () => faker.vehicle.manufacturer(),
    };
  }

  private model(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'vehicleModel',
      callback: () => faker.vehicle.model(),
    };
  }

  private type(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'vehicleType',
      callback: () => faker.vehicle.type(),
    };
  }

  private fuel(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'fuel',
      callback: () => faker.vehicle.fuel(),
    };
  }

  private bicycle(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'bicycle',
      callback: () => faker.vehicle.bicycle(),
    };
  }

  toFakerCandidates(): FakerCandidate[] {
    return [
      this.vehicle(),
      this.manufacturer(),
      this.model(),
      this.type(),
      this.fuel(),
      this.bicycle(),
    ];
  }
}
