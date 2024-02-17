import { AbstractFakerModule } from './abstract-faker-module';
import { FakerCandidate } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';

export class PhoneModule extends AbstractFakerModule {
  private phoneNumber(): FakerCandidate {
    return {
      method: 'phoneNumber',
      callback: () => faker.phone.number(),
    };
  }

  private imei(): FakerCandidate {
    return {
      method: 'imei',
      callback: () => faker.phone.imei(),
    };
  }

  toFakerCandidates(): FakerCandidate[] {
    return [this.phoneNumber(), this.imei()];
  }
}
