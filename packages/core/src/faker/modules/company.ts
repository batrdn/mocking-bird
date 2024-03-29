import { FakerCandidate, FieldType } from '../../types';
import { faker } from '@faker-js/faker';
import { BaseFakerModule } from './base-faker-module';

export class CompanyModule extends BaseFakerModule {
  private name(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'name',
      callback: () => faker.company.name(),
    };
  }

  private catchPhrase(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'catchPhrase',
      callback: () => faker.company.catchPhrase(),
    };
  }

  private buzzPhrase(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'buzzPhrase',
      callback: () => faker.company.buzzPhrase(),
    };
  }

  private catchPhraseAdjective(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'catchPhraseAdjective',
      callback: () => faker.company.catchPhraseAdjective(),
    };
  }

  private catchPhraseDescriptor(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'catchPhraseDescriptor',
      callback: () => faker.company.catchPhraseDescriptor(),
    };
  }

  private catchPhraseNoun(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'catchPhraseNoun',
      callback: () => faker.company.catchPhraseNoun(),
    };
  }

  private buzzAdjective(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'buzzAdjective',
      callback: () => faker.company.buzzAdjective(),
    };
  }

  private buzzVerb(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'buzzVerb',
      callback: () => faker.company.buzzVerb(),
    };
  }

  private buzzNoun(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'buzzNoun',
      callback: () => faker.company.buzzNoun(),
    };
  }

  override toFakerCandidates(): FakerCandidate[] {
    return [
      this.name(),
      this.catchPhrase(),
      this.buzzPhrase(),
      this.catchPhraseAdjective(),
      this.catchPhraseDescriptor(),
      this.catchPhraseNoun(),
      this.buzzAdjective(),
      this.buzzVerb(),
      this.buzzNoun(),
    ];
  }
}
