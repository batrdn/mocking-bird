import { BaseFakerModule } from './base-faker-module';
import { FakerCandidate, FieldType, Rule } from '@mocking-bird/core';
import { faker } from '@faker-js/faker';

export class WordModule extends BaseFakerModule {
  private getOptions(
    rule: Rule | undefined
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
      type: FieldType.STRING,
      method: 'adjective',
      callback: (rule: Rule | undefined) =>
        faker.word.adjective(this.getOptions(rule)),
    };
  }

  private noun(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'noun',
      callback: (rule: Rule | undefined) =>
        faker.word.noun(this.getOptions(rule)),
    };
  }

  private verb(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'verb',
      callback: (rule: Rule | undefined) =>
        faker.word.verb(this.getOptions(rule)),
    };
  }

  private adverb(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'adverb',
      callback: (rule: Rule | undefined) =>
        faker.word.adverb(this.getOptions(rule)),
    };
  }

  private conjunction(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'conjunction',
      callback: (rule: Rule | undefined) =>
        faker.word.conjunction(this.getOptions(rule)),
    };
  }

  private interjection(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'interjection',
      callback: (rule: Rule | undefined) =>
        faker.word.interjection(this.getOptions(rule)),
    };
  }

  private preposition(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'preposition',
      callback: (rule: Rule | undefined) =>
        faker.word.preposition(this.getOptions(rule)),
    };
  }

  private words(): FakerCandidate {
    return {
      type: FieldType.STRING,
      method: 'words',
      callback: (rule: Rule | undefined) => {
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

  override toFakerCandidates(): FakerCandidate[] {
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
