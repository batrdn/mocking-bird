import { FakerCandidate, FieldType } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';
import { AbstractFakerModule } from './abstract-faker-module';

export class AnimalModule extends AbstractFakerModule {
  private dog(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'dog',
      callback: () => faker.animal.dog(),
    };
  }

  private cat(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'cat',
      callback: () => faker.animal.cat(),
    };
  }

  private snake(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'snake',
      callback: () => faker.animal.snake(),
    };
  }

  private bear(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'bear',
      callback: () => faker.animal.bear(),
    };
  }

  private lion(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'lion',
      callback: () => faker.animal.lion(),
    };
  }

  private cetacean(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'cetacean',
      callback: () => faker.animal.cetacean(),
    };
  }

  private horse(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'horse',
      callback: () => faker.animal.horse(),
    };
  }

  private bird(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'bird',
      callback: () => faker.animal.bird(),
    };
  }

  private cow(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'cow',
      callback: () => faker.animal.cow(),
    };
  }

  private fish(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'fish',
      callback: () => faker.animal.fish(),
    };
  }

  private crocodilia(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'crocodilia',
      callback: () => faker.animal.crocodilia(),
    };
  }

  private insect(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'insect',
      callback: () => faker.animal.insect(),
    };
  }

  private rabbit(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'rabbit',
      callback: () => faker.animal.rabbit(),
    };
  }

  private rodent(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'rodent',
      callback: () => faker.animal.rodent(),
    };
  }

  private type(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'animalType',
      callback: () => faker.animal.type(),
    };
  }

  toFakerCandidates(): FakerCandidate[] {
    return [
      this.dog(),
      this.cat(),
      this.snake(),
      this.bear(),
      this.lion(),
      this.cetacean(),
      this.horse(),
      this.bird(),
      this.cow(),
      this.fish(),
      this.crocodilia(),
      this.insect(),
      this.rabbit(),
      this.rodent(),
      this.type(),
    ];
  }
}
