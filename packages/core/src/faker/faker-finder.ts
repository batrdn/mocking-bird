import Fuse from 'fuse.js';
import { FakerCandidate } from '@mocking-bird/core';

export class FakerFinder {
  private readonly fuse: Fuse<FakerCandidate>;

  constructor() {
    this.fuse = new Fuse([], {
      includeScore: true,
      shouldSort: true, // sort all results by score. Best match is the first item with the minimum score
      keys: ['method'],
    });
  }

  search(fieldName: string): { faker: FakerCandidate; score?: number }[] {
    return this.fuse.search(fieldName).map((candidate) => ({
      faker: candidate.item,
      score: candidate.score,
    }));
  }
}
