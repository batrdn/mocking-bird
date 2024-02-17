import { AbstractFakerModule } from './abstract-faker-module';
import { FakerCandidate } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';

export class InternetModule extends AbstractFakerModule {
  private email(): FakerCandidate {
    return {
      method: 'email',
      callback: () => faker.internet.email(),
    };
  }

  private userName(): FakerCandidate {
    return {
      method: 'userName',
      callback: () => faker.internet.userName(),
    };
  }

  private domainName(): FakerCandidate {
    return {
      method: 'domainName',
      callback: () => faker.internet.domainName(),
    };
  }

  private domainSuffix(): FakerCandidate {
    return {
      method: 'domainSuffix',
      callback: () => faker.internet.domainSuffix(),
    };
  }

  private domainWord(): FakerCandidate {
    return {
      method: 'domainWord',
      callback: () => faker.internet.domainWord(),
    };
  }

  private ip(): FakerCandidate {
    return {
      method: 'ip',
      callback: () => faker.internet.ip(),
    };
  }

  private ipv4(): FakerCandidate {
    return {
      method: 'ipv4',
      callback: () => faker.internet.ipv4(),
    };
  }

  private ipv6(): FakerCandidate {
    return {
      method: 'ipv6',
      callback: () => faker.internet.ipv6(),
    };
  }

  private userAgent(): FakerCandidate {
    return {
      method: 'userAgent',
      callback: () => faker.internet.userAgent(),
    };
  }

  private color(): FakerCandidate {
    return {
      method: 'color',
      callback: () => faker.internet.color(),
    };
  }

  private mac(): FakerCandidate {
    return {
      method: 'mac',
      callback: () => faker.internet.mac(),
    };
  }

  private password(): FakerCandidate {
    return {
      method: 'password',
      callback: (rule) =>
        faker.internet.password({
          length: rule?.size,
        }),
    };
  }

  private protocol(): FakerCandidate {
    return {
      method: 'protocol',
      callback: () => faker.internet.protocol(),
    };
  }

  private url(): FakerCandidate {
    return {
      method: 'url',
      callback: () => faker.internet.url(),
    };
  }

  private displayName(): FakerCandidate {
    return {
      method: 'displayName',
      callback: () => faker.internet.displayName(),
    };
  }

  private httpMethod(): FakerCandidate {
    return {
      method: 'httpMethod',
      callback: () => faker.internet.httpMethod(),
    };
  }

  private emoji(): FakerCandidate {
    return {
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
