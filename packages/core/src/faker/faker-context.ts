import { FakerCallback, NonArrayFieldType } from '@mocking-bird/core';
import { FakerFactory } from './faker-factory';
import { FakerFinder } from './faker-finder';

export class FakerContext {
  private static readonly FUZZY_SEARCH_THRESHOLD = 0.5;
  private static instance: FakerContext;

  private readonly fakerFactory: FakerFactory;
  private readonly fakerFinder: FakerFinder;

  private constructor() {
    this.fakerFactory = new FakerFactory();
    this.fakerFinder = new FakerFinder();
  }

  static getInstance(): FakerContext {
    if (!FakerContext.instance) {
      FakerContext.instance = new FakerContext();
    }

    return FakerContext.instance;
  }

  findCallback(fieldName: string, type: NonArrayFieldType): FakerCallback | undefined {
    const searchResult = this.fakerFinder.search(fieldName, type);

    if (searchResult.length === 0) {
      return undefined;
    }

    const bestCandidate = searchResult[0];

    if (
      bestCandidate.score &&
      bestCandidate.score < FakerContext.FUZZY_SEARCH_THRESHOLD
    ) {
      return bestCandidate.faker.callback;
    }

    return undefined;
  }

  getDefaultCallback(type: NonArrayFieldType): FakerCallback {
    return this.fakerFactory.getFakerCallback(type);
  }
}
