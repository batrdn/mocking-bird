import { AbstractFakerModule } from './abstract-faker-module';
import { FakerCandidate } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';

export class VehicleModule extends AbstractFakerModule {
  private vehicle(): FakerCandidate {
    return {
      method: 'vehicle',
      callback: () => faker.vehicle.vehicle(),
    };
  }

  private manufacturer(): FakerCandidate {
    return {
      method: 'manufacturer',
      callback: () => faker.vehicle.manufacturer(),
    };
  }

  private model(): FakerCandidate {
    return {
      method: 'vehicleModel',
      callback: () => faker.vehicle.model(),
    };
  }

  private type(): FakerCandidate {
    return {
      method: 'vehicleType',
      callback: () => faker.vehicle.type(),
    };
  }

  private fuel(): FakerCandidate {
    return {
      method: 'fuel',
      callback: () => faker.vehicle.fuel(),
    };
  }

  private bicycle(): FakerCandidate {
    return {
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
