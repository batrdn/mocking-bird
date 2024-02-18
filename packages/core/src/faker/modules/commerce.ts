import { FakerCandidate, FieldType } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';
import { AbstractFakerModule } from './abstract-faker-module';

export class CommerceModule extends AbstractFakerModule {
  private department(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'department',
      callback: () => faker.commerce.department(),
    };
  }

  private productName(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'productName',
      callback: () => faker.commerce.productName(),
    };
  }

  private price(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'price',
      callback: (rule) =>
        faker.commerce.price({
          min: rule?.min,
          max: rule?.max,
        }),
    };
  }

  private priceFloat(): FakerCandidate {
    return {
      type: FieldType.FLOAT,
      method: 'priceFloat',
      callback: (rule) =>
        this.convertToFloat(
          faker.commerce.price({
            min: rule?.min,
            max: rule?.max,
          }),
          rule
        ),
    };
  }

  private productAdjective(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'productAdjective',
      callback: () => faker.commerce.productAdjective(),
    };
  }

  private productMaterial(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'productMaterial',
      callback: () => faker.commerce.productMaterial(),
    };
  }

  private product(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'product',
      callback: () => faker.commerce.product(),
    };
  }

  private productDescription(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'productDescription',
      callback: () => faker.commerce.productDescription(),
    };
  }

  private isbn(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'isbn',
      callback: () => faker.commerce.isbn(),
    };
  }

  toFakerCandidates(): FakerCandidate[] {
    return [
      this.department(),
      this.productName(),
      this.price(),
      this.priceFloat(),
      this.productAdjective(),
      this.productMaterial(),
      this.product(),
      this.productDescription(),
      this.isbn(),
    ];
  }
}
