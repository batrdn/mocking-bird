import { FakerCandidate } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';
import { AbstractFakerModule } from './abstract-faker-module';

export class CompanyModule extends AbstractFakerModule {
  private name(): FakerCandidate {
    return {
      method: 'name',
      callback: () => faker.company.name(),
    };
  }

  private catchPhrase(): FakerCandidate {
    return {
      method: 'catchPhrase',
      callback: () => faker.company.catchPhrase(),
    };
  }

  private buzzPhrase(): FakerCandidate {
    return {
      method: 'buzzPhrase',
      callback: () => faker.company.buzzPhrase(),
    };
  }

  private catchPhraseAdjective(): FakerCandidate {
    return {
      method: 'catchPhraseAdjective',
      callback: () => faker.company.catchPhraseAdjective(),
    };
  }

  private catchPhraseDescriptor(): FakerCandidate {
    return {
      method: 'catchPhraseDescriptor',
      callback: () => faker.company.catchPhraseDescriptor(),
    };
  }

  private catchPhraseNoun(): FakerCandidate {
    return {
      method: 'catchPhraseNoun',
      callback: () => faker.company.catchPhraseNoun(),
    };
  }

  private buzzAdjective(): FakerCandidate {
    return {
      method: 'buzzAdjective',
      callback: () => faker.company.buzzAdjective(),
    };
  }

  private buzzVerb(): FakerCandidate {
    return {
      method: 'buzzVerb',
      callback: () => faker.company.buzzVerb(),
    };
  }

  private buzzNoun(): FakerCandidate {
    return {
      method: 'buzzNoun',
      callback: () => faker.company.buzzNoun(),
    };
  }

  toFakerCandidates(): FakerCandidate[] {
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
