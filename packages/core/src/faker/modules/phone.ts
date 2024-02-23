import { BaseFakerModule } from './base-faker-module';
import {FakerCandidate, FieldType} from '@mocking-bird/core';
import { faker } from '@faker-js/faker';

export class PhoneModule extends BaseFakerModule {
  private phoneNumber(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'phoneNumber',
      callback: () => faker.phone.number(),
    };
  }

  private imei(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'imei',
      callback: () => faker.phone.imei(),
    };
  }

  override toFakerCandidates(): FakerCandidate[] {
    return [this.phoneNumber(), this.imei()];
  }
}
