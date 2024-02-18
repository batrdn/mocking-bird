import { AbstractFakerModule } from './abstract-faker-module';
import {FakerCandidate, FieldType} from '@mocking-bird/core';
import { faker } from '@faker-js/faker';

export class InternetModule extends AbstractFakerModule {
  private email(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'email',
      callback: () => faker.internet.email(),
    };
  }

  private userName(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'userName',
      callback: () => faker.internet.userName(),
    };
  }

  private domainName(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'domainName',
      callback: () => faker.internet.domainName(),
    };
  }

  private domainSuffix(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'domainSuffix',
      callback: () => faker.internet.domainSuffix(),
    };
  }

  private domainWord(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'domainWord',
      callback: () => faker.internet.domainWord(),
    };
  }

  private ip(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'ip',
      callback: () => faker.internet.ip(),
    };
  }

  private ipv4(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'ipv4',
      callback: () => faker.internet.ipv4(),
    };
  }

  private ipv6(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'ipv6',
      callback: () => faker.internet.ipv6(),
    };
  }

  private userAgent(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'userAgent',
      callback: () => faker.internet.userAgent(),
    };
  }

  private color(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'color',
      callback: () => faker.internet.color(),
    };
  }

  private mac(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'mac',
      callback: () => faker.internet.mac(),
    };
  }

  private password(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'password',
      callback: (rule) =>
        faker.internet.password({
          length: rule?.size,
        }),
    };
  }

  private protocol(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'protocol',
      callback: () => faker.internet.protocol(),
    };
  }

  private url(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'url',
      callback: () => faker.internet.url(),
    };
  }

  private displayName(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'displayName',
      callback: () => faker.internet.displayName(),
    };
  }

  private httpMethod(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'httpMethod',
      callback: () => faker.internet.httpMethod(),
    };
  }

  private emoji(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'emoji',
      callback: () => faker.internet.emoji(),
    };
  }

  toFakerCandidates(): FakerCandidate[] {
    return [
      this.email(),
      this.userName(),
      this.domainName(),
      this.domainSuffix(),
      this.domainWord(),
      this.ip(),
      this.ipv4(),
      this.ipv6(),
      this.userAgent(),
      this.color(),
      this.mac(),
      this.password(),
      this.protocol(),
      this.url(),
      this.displayName(),
      this.httpMethod(),
      this.emoji(),
    ];
  }
}
