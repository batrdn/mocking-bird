import { FakerCandidate } from '@mocking-bird/core';

export abstract class AbstractFakerModule {
  abstract toFakerCandidates(): FakerCandidate[]
}
