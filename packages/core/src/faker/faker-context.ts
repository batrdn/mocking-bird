import { FakerCallback, NonArrayFieldType } from '@mocking-bird/core';
import { FakerFactory } from './faker-factory';
import { FakerFinder } from './faker-finder';

/**
 * ### Overview
 *
 * FakerContext is a singleton class responsible for providing the suitable faker callback for a given field and type.
 *
 * @remarks
 *
 * There are two main functionalities provided by this class:
 *
 * - Find the suitable faker callback for a given field and type, which uses {@link FakerFinder#search} to find the
 * best match.
 *
 * - Provide the default faker callback for a given type, which uses {@link FakerFactory#getFakerCallback} to get
 * the default faker callback.
 *
 * Because the fake value generation process remains the same, the class is designed to be a singleton to avoid
 * unnecessary instantiation of the class
 */
export class FakerContext {
  /**
   * The threshold score for the search result to be considered as a suitable match.
   * The best match has the score of 0, and the worst match has the score of 1.
   * We consider a match to be suitable if it matches at least 50% accurately.
   *
   * @see FakerFinder
   * For the library and the algorithm used for the search.
   *
   * @private
   */
  private static readonly SEARCH_SCORE_THRESHOLD = 0.5;
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

  /**
   * Find the suitable faker callback for a given field and type.
   * A suitable faker callback is found using {@link FakerFinder#search} to find the best match based on the field
   * name and type.
   *
   * @param fieldName The field name to find the suitable faker callback for, e.g., address, firstName, age etc...
   * @param type The (non-array) type of the field.
   */
  findCallback(
    fieldName: string,
    type: NonArrayFieldType
  ): FakerCallback | undefined {
    const searchResult = this.fakerFinder.search(fieldName, type);

    if (searchResult.length === 0) {
      return undefined;
    }

    const bestCandidate = searchResult[0];

    if (
      bestCandidate.score &&
      bestCandidate.score < FakerContext.SEARCH_SCORE_THRESHOLD
    ) {
      return bestCandidate.faker.callback;
    }

    return undefined;
  }

  getDefaultCallback(type: NonArrayFieldType): FakerCallback {
    return this.fakerFactory.getFakerCallback(type);
  }
}
