import { AbstractFakerModule } from './abstract-faker-module';
import { faker } from '@faker-js/faker';
import {FakerCandidate, FieldType} from '@mocking-bird/core';

export class MusicModule extends AbstractFakerModule {
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

  toFakerCandidates(): FakerCandidate[] {
    return [this.genre(), this.songName()];
  }
}
