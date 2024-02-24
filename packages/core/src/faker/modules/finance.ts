import { FakerCandidate, FieldType, Rule } from '../../types';
import { faker } from '@faker-js/faker';
import { BaseFakerModule } from './base-faker-module';
import { FakerHelpers } from '../faker-helpers';

export class FinanceModule extends BaseFakerModule {
  private accountNumber(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'accountNumber',
      callback: (rule: Rule | undefined) =>
        faker.finance.accountNumber(rule?.size),
    };
  }

  private accountNumberInt(): FakerCandidate {
    return {
      type: FieldType.NUMBER,
      method: 'accountNumber',
      callback: (rule: Rule | undefined) =>
        this.convertToInt(faker.finance.accountNumber(rule?.size), rule),
    };
  }

  private accountName(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'accountName',
      callback: () => faker.finance.accountName(),
    };
  }

  private routingNumber(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'routingNumber',
      callback: () => faker.finance.routingNumber(),
    };
  }

  private routingNumberInt(): FakerCandidate {
    return {
      type: FieldType.NUMBER,
      method: 'routingNumber',
      callback: () => this.convertToInt(faker.finance.routingNumber()),
    };
  }

  private maskedNumber(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'maskedNumber',
      callback: (rule) => faker.finance.maskedNumber(rule?.size),
    };
  }

  private amount(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'amount',
      callback: (rule) => {
        return faker.finance.amount(FakerHelpers.getMinMaxRule(rule));
      },
    };
  }

  private amountFloat(): FakerCandidate {
    return {
      type: FieldType.NUMBER,
      method: 'amount',
      callback: (rule) =>
        this.convertToFloat(
          faker.finance.amount(FakerHelpers.getMinMaxRule(rule)),
          rule
        ),
    };
  }

  private transactionType(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'transactionType',
      callback: () => faker.finance.transactionType(),
    };
  }

  private currency(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'currency',
      callback: () => faker.finance.currency().code,
    };
  }

  private bitcoinAddress(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'bitcoinAddress',
      callback: () => faker.finance.bitcoinAddress(),
    };
  }

  private ethereumAddress(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'ethereumAddress',
      callback: () => faker.finance.ethereumAddress(),
    };
  }

  private iban(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'iban',
      callback: () => faker.finance.iban(),
    };
  }

  private bic(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'bic',
      callback: () => faker.finance.bic(),
    };
  }

  private creditCardNumber(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'creditCardNumber',
      callback: () => faker.finance.creditCardNumber(),
    };
  }

  private creditCardCVV(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'creditCardCVV',
      callback: () => faker.finance.creditCardCVV(),
    };
  }

  private creditCardCVVInt(): FakerCandidate {
    return {
      type: FieldType.NUMBER,
      method: 'creditCardCVV',
      callback: () => this.convertToInt(faker.finance.creditCardCVV()),
    };
  }

  private pin(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'pin',
      callback: (rule: Rule | undefined) => faker.finance.pin(rule?.size),
    };
  }

  private pinInt(): FakerCandidate {
    return {
      type: FieldType.NUMBER,
      method: 'pin',
      callback: (rule) => this.convertToInt(faker.finance.pin(rule?.size)),
    };
  }

  private transactionDescription(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'transactionDescription',
      callback: () => faker.finance.transactionDescription(),
    };
  }

  override toFakerCandidates(): FakerCandidate[] {
    return [
      this.accountNumber(),
      this.accountNumberInt(),
      this.accountName(),
      this.routingNumber(),
      this.routingNumberInt(),
      this.maskedNumber(),
      this.amount(),
      this.amountFloat(),
      this.transactionType(),
      this.currency(),
      this.bitcoinAddress(),
      this.ethereumAddress(),
      this.iban(),
      this.bic(),
      this.creditCardNumber(),
      this.creditCardCVVInt(),
      this.creditCardCVV(),
      this.pin(),
      this.pinInt(),
      this.transactionDescription(),
    ];
  }
}
