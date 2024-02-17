import { FakerCandidate } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';
import { AbstractFakerModule } from './abstract-faker-module';
import {FakerHelpers} from "../faker-helpers";

export class FinanceModule extends AbstractFakerModule {

  private accountNumber(): FakerCandidate {
    return {
      method: 'accountNumber',
      callback: (rule) => faker.finance.accountNumber(rule?.size),
    };
  }

  private accountName(): FakerCandidate {
    return {
      method: 'accountName',
      callback: () => faker.finance.accountName(),
    };
  }

  private routingNumber(): FakerCandidate {
    return {
      method: 'routingNumber',
      callback: () => faker.finance.routingNumber(),
    };
  }

  private maskedNumber(): FakerCandidate {
    return {
      method: 'maskedNumber',
      callback: (rule) => faker.finance.maskedNumber(rule?.size),
    };
  }

  private amount(): FakerCandidate {
    return {
      method: 'amount',
      callback: (rule) => {
        return faker.finance.amount(FakerHelpers.getMinMaxRule(rule));
      },
    };
  }

  private transactionType(): FakerCandidate {
    return {
      method: 'transactionType',
      callback: () => faker.finance.transactionType(),
    };
  }

  private currency(): FakerCandidate {
    return {
      method: 'currency',
      callback: () => faker.finance.currency(),
    };
  }

  private bitcoinAddress(): FakerCandidate {
    return {
      method: 'bitcoinAddress',
      callback: () => faker.finance.bitcoinAddress(),
    };
  }

  private ethereumAddress(): FakerCandidate {
    return {
      method: 'ethereumAddress',
      callback: () => faker.finance.ethereumAddress(),
    };
  }

  private iban(): FakerCandidate {
    return {
      method: 'iban',
      callback: (rule) => faker.finance.iban(),
    };
  }

  private bic(): FakerCandidate {
    return {
      method: 'bic',
      callback: (rule) => faker.finance.bic(),
    };
  }

  private creditCardNumber(): FakerCandidate {
    return {
      method: 'creditCardNumber',
      callback: (rule) => faker.finance.creditCardNumber(),
    };
  }

  private creditCardCVV(): FakerCandidate {
    return {
      method: 'creditCardCVV',
      callback: () => faker.finance.creditCardCVV(),
    };
  }

  private pin(): FakerCandidate {
    return {
      method: 'pin',
      callback: (rule) => faker.finance.pin(rule?.size),
    };
  }

  private transactionDescription(): FakerCandidate {
    return {
      method: 'transactionDescription',
      callback: () => faker.finance.transactionDescription(),
    };
  }

  toFakerCandidates(): FakerCandidate[] {
    return [
      this.accountNumber(),
      this.accountName(),
      this.routingNumber(),
      this.maskedNumber(),
      this.amount(),
      this.transactionType(),
      this.currency(),
      this.bitcoinAddress(),
      this.ethereumAddress(),
      this.iban(),
      this.bic(),
      this.creditCardNumber(),
      this.creditCardCVV(),
      this.pin(),
      this.transactionDescription(),
    ];
  }
}
