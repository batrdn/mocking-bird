import { FakerCandidate } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';
import { AbstractFakerModule } from './abstract-faker-module';

export class AnimalModule extends AbstractFakerModule {
  private dog(): FakerCandidate {
    return {
      method: 'dog',
      callback: () => faker.animal.dog(),
    };
  }

  private cat(): FakerCandidate {
    return {
      method: 'cat',
      callback: () => faker.animal.cat(),
    };
  }

  private snake(): FakerCandidate {
    return {
      method: 'snake',
      callback: () => faker.animal.snake(),
    };
  }

  private bear(): FakerCandidate {
    return {
      method: 'bear',
      callback: () => faker.animal.bear(),
    };
  }

  private lion(): FakerCandidate {
    return {
      method: 'lion',
      callback: () => faker.animal.lion(),
    };
  }

  private cetacean(): FakerCandidate {
    return {
      method: 'cetacean',
      callback: () => faker.animal.cetacean(),
    };
  }

  private horse(): FakerCandidate {
    return {
      method: 'horse',
      callback: () => faker.animal.horse(),
    };
  }

  private bird(): FakerCandidate {
    return {
      method: 'bird',
      callback: () => faker.animal.bird(),
    };
  }

  private cow(): FakerCandidate {
    return {
      method: 'cow',
      callback: () => faker.animal.cow(),
    };
  }

  private fish(): FakerCandidate {
    return {
      method: 'fish',
      callback: () => faker.animal.fish(),
    };
  }

  private crocodilia(): FakerCandidate {
    return {
      method: 'crocodilia',
      callback: () => faker.animal.crocodilia(),
    };
  }

  private insect(): FakerCandidate {
    return {
      method: 'insect',
      callback: () => faker.animal.insect(),
    };
  }

  private rabbit(): FakerCandidate {
    return {
      method: 'rabbit',
      callback: () => faker.animal.rabbit(),
    };
  }

  private rodent(): FakerCandidate {
    return {
      method: 'rodent',
      callback: () => faker.animal.rodent(),
    };
  }

  private type(): FakerCandidate {
    return {
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
