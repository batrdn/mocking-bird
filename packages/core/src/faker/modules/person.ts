import { BaseFakerModule } from './base-faker-module';
import {FakerCandidate, FieldType} from '@mocking-bird/core';
import { faker } from '@faker-js/faker';

export class PersonModule extends BaseFakerModule {
  private firstName(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'firstName',
      callback: () => faker.person.firstName(),
    };
  }

  private lastName(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'lastName',
      callback: () => faker.person.lastName(),
    };
  }

  private fullName(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'fullName',
      callback: () => faker.person.fullName(),
    };
  }

  private middleName(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'middleName',
      callback: () => faker.person.middleName(),
    };
  }

  private gender(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'gender',
      callback: () => faker.person.gender(),
    };
  }

  private sex(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'sex',
      callback: () => faker.person.sex(),
    };
  }

  private bio(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'bio',
      callback: () => faker.person.bio(),
    };
  }

  private prefix(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'personPrefix',
      callback: () => faker.person.prefix(),
    };
  }

  private suffix(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'personSuffix',
      callback: () => faker.person.suffix(),
    };
  }

  private jobTitle(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'jobTitle',
      callback: () => faker.person.jobTitle(),
    };
  }

  private jobDescriptor(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'jobDescriptor',
      callback: () => faker.person.jobDescriptor(),
    };
  }

  private jobArea(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'jobArea',
      callback: () => faker.person.jobArea(),
    };
  }

  private jobType(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'jobType',
      callback: () => faker.person.jobType(),
    };
  }

  private zodiacSign(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'zodiacSign',
      callback: () => faker.person.zodiacSign(),
    };
  }

  override toFakerCandidates(): FakerCandidate[] {
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
