import { AbstractFakerModule } from './abstract-faker-module';
import { FakerCandidate } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';

export class ScienceModule extends AbstractFakerModule {
  chemicalElement(): FakerCandidate {
    return {
      method: 'chemicalElement',
      callback: () => faker.science.chemicalElement(),
    };
  }

  unit(): FakerCandidate {
    return {
      method: 'unit',
      callback: () => faker.science.unit(),
    };
  }

  toFakerCandidates(): FakerCandidate[] {
    return [this.chemicalElement(), this.unit()];
  }
}
