import { BaseFakerModule } from './base-faker-module';
import {FakerCandidate, FieldType} from '@mocking-bird/core';
import { faker } from '@faker-js/faker';

export class SystemModule extends BaseFakerModule {
  private fileName(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'fileName',
      callback: () => faker.system.fileName(),
    };
  }

  private commonFileName(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'commonFileName',
      callback: () => faker.system.commonFileName(),
    };
  }

  private mimeType(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'mimeType',
      callback: () => faker.system.mimeType(),
    };
  }

  private commonFileType(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'commonFileType',
      callback: () => faker.system.commonFileType(),
    };
  }

  private commonFileExt(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'commonFileExt',
      callback: () => faker.system.commonFileExt(),
    };
  }

  private fileType(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'fileType',
      callback: () => faker.system.fileType(),
    };
  }

  private fileExt(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'fileExt',
      callback: () => faker.system.fileExt(),
    };
  }

  private semver(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'semver',
      callback: () => faker.system.semver(),
    };
  }

  private directoryPath(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'directoryPath',
      callback: () => faker.system.directoryPath(),
    };
  }

  private filePath(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'filePath',
      callback: () => faker.system.filePath(),
    };
  }

  private networkProtocol(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'networkProtocol',
      callback: () => faker.system.networkInterface(),
    };
  }

  private cron(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'cron',
      callback: () => faker.system.cron(),
    };
  }

  override toFakerCandidates(): FakerCandidate[] {
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
