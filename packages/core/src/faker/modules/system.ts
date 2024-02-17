import { AbstractFakerModule } from './abstract-faker-module';
import { FakerCandidate } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';

export class SystemModule extends AbstractFakerModule {
  private fileName(): FakerCandidate {
    return {
      method: 'fileName',
      callback: () => faker.system.fileName(),
    };
  }

  private commonFileName(): FakerCandidate {
    return {
      method: 'commonFileName',
      callback: () => faker.system.commonFileName(),
    };
  }

  private mimeType(): FakerCandidate {
    return {
      method: 'mimeType',
      callback: () => faker.system.mimeType(),
    };
  }

  private commonFileType(): FakerCandidate {
    return {
      method: 'commonFileType',
      callback: () => faker.system.commonFileType(),
    };
  }

  private commonFileExt(): FakerCandidate {
    return {
      method: 'commonFileExt',
      callback: () => faker.system.commonFileExt(),
    };
  }

  private fileType(): FakerCandidate {
    return {
      method: 'fileType',
      callback: () => faker.system.fileType(),
    };
  }

  private fileExt(): FakerCandidate {
    return {
      method: 'fileExt',
      callback: () => faker.system.fileExt(),
    };
  }

  private semver(): FakerCandidate {
    return {
      method: 'semver',
      callback: () => faker.system.semver(),
    };
  }

  private directoryPath(): FakerCandidate {
    return {
      method: 'directoryPath',
      callback: () => faker.system.directoryPath(),
    };
  }

  private filePath(): FakerCandidate {
    return {
      method: 'filePath',
      callback: () => faker.system.filePath(),
    };
  }

  private networkProtocol(): FakerCandidate {
    return {
      method: 'networkProtocol',
      callback: () => faker.system.networkInterface(),
    };
  }

  private cron(): FakerCandidate {
    return {
      method: 'cron',
      callback: () => faker.system.cron(),
    };
  }

  toFakerCandidates(): FakerCandidate[] {
    return [
      this.fileName(),
      this.commonFileName(),
      this.mimeType(),
      this.commonFileType(),
      this.commonFileExt(),
      this.fileType(),
      this.fileExt(),
      this.semver(),
      this.directoryPath(),
      this.filePath(),
      this.networkProtocol(),
      this.cron(),
    ];
  }
}
