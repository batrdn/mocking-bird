import {FakerCandidate, FieldType} from '@mocking-bird/core';
import { faker } from '@faker-js/faker';
import { BaseFakerModule } from './base-faker-module';

export class ImageModule extends BaseFakerModule {
  private avatar(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'avatar',
      callback: () => faker.image.avatar(),
    };
  }

  private url(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'image',
      callback: () => faker.image.url(),
    };
  }

  private dataUri(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'dataUri',
      callback: () => faker.image.dataUri(),
    };
  }

  override toFakerCandidates(): FakerCandidate[] {
    return [this.avatar(), this.url(), this.dataUri()];
  }
}
