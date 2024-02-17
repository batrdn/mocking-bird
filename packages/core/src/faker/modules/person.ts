import { AbstractFakerModule } from './abstract-faker-module';
import { FakerCandidate } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';

export class PersonModule extends AbstractFakerModule {
  private firstName(): FakerCandidate {
    return {
      method: 'firstName',
      callback: () => faker.person.firstName(),
    };
  }

  private lastName(): FakerCandidate {
    return {
      method: 'lastName',
      callback: () => faker.person.lastName(),
    };
  }

  private fullName(): FakerCandidate {
    return {
      method: 'fullName',
      callback: () => faker.person.fullName(),
    };
  }

  private middleName(): FakerCandidate {
    return {
      method: 'middleName',
      callback: () => faker.person.middleName(),
    };
  }

  private gender(): FakerCandidate {
    return {
      method: 'gender',
      callback: () => faker.person.gender(),
    };
  }

  private sex(): FakerCandidate {
    return {
      method: 'sex',
      callback: () => faker.person.sex(),
    };
  }

  private bio(): FakerCandidate {
    return {
      method: 'bio',
      callback: () => faker.person.bio(),
    };
  }

  private prefix(): FakerCandidate {
    return {
      method: 'personPrefix',
      callback: () => faker.person.prefix(),
    };
  }

  private suffix(): FakerCandidate {
    return {
      method: 'personSuffix',
      callback: () => faker.person.suffix(),
    };
  }

  private jobTitle(): FakerCandidate {
    return {
      method: 'jobTitle',
      callback: () => faker.person.jobTitle(),
    };
  }

  private jobDescriptor(): FakerCandidate {
    return {
      method: 'jobDescriptor',
      callback: () => faker.person.jobDescriptor(),
    };
  }

  private jobArea(): FakerCandidate {
    return {
      method: 'jobArea',
      callback: () => faker.person.jobArea(),
    };
  }

  private jobType(): FakerCandidate {
    return {
      method: 'jobType',
      callback: () => faker.person.jobType(),
    };
  }

  private zodiacSign(): FakerCandidate {
    return {
      method: 'zodiacSign',
      callback: () => faker.person.zodiacSign(),
    };
  }

  toFakerCandidates(): FakerCandidate[] {
    return [
      this.firstName(),
      this.lastName(),
      this.fullName(),
      this.middleName(),
      this.gender(),
      this.sex(),
      this.bio(),
      this.prefix(),
      this.suffix(),
      this.jobTitle(),
      this.jobDescriptor(),
      this.jobArea(),
      this.jobType(),
      this.zodiacSign(),
    ];
  }
}
