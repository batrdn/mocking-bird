import { FakerCandidate } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';
import { AbstractFakerModule } from './abstract-faker-module';

export class ImageModule extends AbstractFakerModule {
  private avatar(): FakerCandidate {
    return {
      method: 'avatar',
      callback: () => faker.image.avatar(),
    };
  }

  private url(): FakerCandidate {
    return {
      method: 'image',
      callback: () => faker.image.url(),
    };
  }

  private dataUri(): FakerCandidate {
    return {
      method: 'dataUri',
      callback: () => faker.image.dataUri(),
    };
  }

  toFakerCandidates(): FakerCandidate[] {
    return [this.avatar(), this.url(), this.dataUri()];
  }
}
