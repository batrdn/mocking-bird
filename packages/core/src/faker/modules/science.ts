import { BaseFakerModule } from './base-faker-module';
import {FakerCandidate, FieldType} from '@mocking-bird/core';
import { faker } from '@faker-js/faker';

export class ScienceModule extends BaseFakerModule {
  chemicalElement(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'chemicalElement',
      callback: () => faker.science.chemicalElement().name,
    };
  }

  unit(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'unit',
      callback: () => faker.science.unit().name,
    };
  }

  override toFakerCandidates(): FakerCandidate[] {
    return [this.chemicalElement(), this.unit()];
  }
}
