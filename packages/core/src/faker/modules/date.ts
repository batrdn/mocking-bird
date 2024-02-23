import { BaseFakerModule } from './base-faker-module';
import { FakerCandidate, FieldType } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';

export class DateModule extends BaseFakerModule {
  private date(): FakerCandidate {
    return {
      type: FieldType.DATE,
      method: 'date',
      callback: () => faker.date.soon(),
    };
  }

  private dateString(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'date',
      callback: () => faker.date.soon().toISOString(),
    };
  }

  private past(): FakerCandidate {
    return {
      type: FieldType.DATE,
      method: 'past',
      callback: () => faker.date.past(),
    };
  }

  private future(): FakerCandidate {
    return {
      type: FieldType.DATE,
      method: 'future',
      callback: () => faker.date.future(),
    };
  }

  private till(): FakerCandidate {
    return {
      type: FieldType.DATE,
      method: 'till',
      callback: () => faker.date.future(),
    };
  }

  private from(): FakerCandidate {
    return {
      type: FieldType.DATE,
      method: 'from',
      callback: () => faker.date.past(),
    };
  }

  private to(): FakerCandidate {
    return {
      type: FieldType.DATE,
      method: 'to',
      callback: () => faker.date.future(),
    };
  }

  private recent(): FakerCandidate {
    return {
      type: FieldType.DATE,
      method: 'recent',
      callback: () => faker.date.recent(),
    };
  }

  private birthdate(): FakerCandidate {
    return {
      type: FieldType.DATE,
      method: 'birthdate',
      callback: () => faker.date.past(),
    };
  }

  override toFakerCandidates(): FakerCandidate[] {
    return [
      this.date(),
      this.dateString(),
      this.past(),
      this.future(),
      this.till(),
      this.from(),
      this.to(),
      this.recent(),
      this.birthdate(),
    ];
  }
}
