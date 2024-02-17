import { FakerCandidate } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';
import { AbstractFakerModule } from './abstract-faker-module';

export class CommerceModule extends AbstractFakerModule {
  private department(): FakerCandidate {
    return {
      method: 'department',
      callback: () => faker.commerce.department(),
    };
  }

  private productName(): FakerCandidate {
    return {
      method: 'productName',
      callback: () => faker.commerce.productName(),
    };
  }

  private price(): FakerCandidate {
    return {
      method: 'price',
      callback: (rule) =>
        faker.commerce.price({
          min: rule?.min,
          max: rule?.max,
        }),
    };
  }

  private productAdjective(): FakerCandidate {
    return {
      method: 'productAdjective',
      callback: () => faker.commerce.productAdjective(),
    };
  }

  private productMaterial(): FakerCandidate {
    return {
      method: 'productMaterial',
      callback: () => faker.commerce.productMaterial(),
    };
  }

  private product(): FakerCandidate {
    return {
      method: 'product',
      callback: () => faker.commerce.product(),
    };
  }

  private productDescription(): FakerCandidate {
    return {
      method: 'productDescription',
      callback: () => faker.commerce.productDescription(),
    };
  }

  private isbn(): FakerCandidate {
    return {
      method: 'isbn',
      callback: (options) => faker.commerce.isbn(),
    };
  }

  toFakerCandidates(): FakerCandidate[] {
    return [
      this.department(),
      this.productName(),
      this.price(),
      this.productAdjective(),
      this.productMaterial(),
      this.product(),
      this.productDescription(),
      this.isbn(),
    ];
  }
}
