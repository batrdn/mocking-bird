import { AbstractFakerModule } from './abstract-faker-module';
import { FakerCandidate, Rule } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';

export class WordModule extends AbstractFakerModule {
  private getOptions(
    rule?: Rule
  ): number | { length: { min: number; max: number } } | undefined {
    if (rule?.size) {
      return rule.size;
    }

    if (rule?.min !== undefined && rule?.max !== undefined) {
      return {
        length: {
          min: rule.min,
          max: rule.max,
        },
      };
    }

    return undefined;
  }

  private adjective(): FakerCandidate {
    return {
      method: 'adjective',
      callback: (rule) => faker.word.adjective(this.getOptions(rule)),
    };
  }

  private noun(): FakerCandidate {
    return {
      method: 'noun',
      callback: (rule) => faker.word.noun(this.getOptions(rule)),
    };
  }

  private verb(): FakerCandidate {
    return {
      method: 'verb',
      callback: (rule) => faker.word.verb(this.getOptions(rule)),
    };
  }

  private adverb(): FakerCandidate {
    return {
      method: 'adverb',
      callback: (rule) => faker.word.adverb(this.getOptions(rule)),
    };
  }

  private conjunction(): FakerCandidate {
    return {
      method: 'conjunction',
      callback: (rule) => faker.word.conjunction(this.getOptions(rule)),
    };
  }

  private interjection(): FakerCandidate {
    return {
      method: 'interjection',
      callback: (rule) => faker.word.interjection(this.getOptions(rule)),
    };
  }

  private preposition(): FakerCandidate {
    return {
      method: 'preposition',
      callback: (rule) => faker.word.preposition(this.getOptions(rule)),
    };
  }

  private words(): FakerCandidate {
    return {
      method: 'words',
      callback: (rule) => {
        if (rule?.size) {
          return faker.word.words(rule.size);
        }

        if (rule?.min !== undefined && rule?.max !== undefined) {
          return faker.word.words({
            count: {
              min: rule.min,
              max: rule.max,
            },
          });
        }

        return faker.word.words();
      },
    };
  }

  toFakerCandidates(): FakerCandidate[] {
    return [
      this.adjective(),
      this.noun(),
      this.verb(),
      this.adverb(),
      this.conjunction(),
      this.interjection(),
      this.preposition(),
      this.words(),
    ];
  }
}
