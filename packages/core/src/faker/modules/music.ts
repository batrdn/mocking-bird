import { AbstractFakerModule } from './abstract-faker-module';
import { faker } from '@faker-js/faker';
import { FakerCandidate } from '@mocking-bird/core';

export class MusicModule extends AbstractFakerModule {
  private genre(): FakerCandidate {
    return {
      method: 'genre',
      callback: () => faker.music.genre(),
    };
  }

  private songName(): FakerCandidate {
    return {
      method: 'song',
      callback: () => faker.music.songName(),
    };
  }

  toFakerCandidates(): FakerCandidate[] {
    return [this.genre(), this.songName()];
  }
}
