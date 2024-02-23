import { BaseFakerModule } from './base-faker-module';
import { faker } from '@faker-js/faker';
import {FakerCandidate, FieldType} from '@mocking-bird/core';

export class MusicModule extends BaseFakerModule {
  private genre(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'genre',
      callback: () => faker.music.genre(),
    };
  }

  private songName(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'song',
      callback: () => faker.music.songName(),
    };
  }

  override toFakerCandidates(): FakerCandidate[] {
    return [this.genre(), this.songName()];
  }
}
