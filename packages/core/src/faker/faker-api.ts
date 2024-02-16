import Fuse from 'fuse.js';
import { NonArrayFieldType, Rule, Value } from '../types';
import { DEFAULT_FAKER_CANDIDATES, FAKER_CANDIDATES } from './faker-candidates';

export class FakerApi {
  // private static fuse = new Fuse(FAKER_CANDIDATES, {
  //   includeScore: true,
  //   shouldSort: true, // sort all results by score. Best match is the first item with the minimum score
  //   keys: ['function'],
  // });

  generate(field: string, type: NonArrayFieldType, rule?: Rule): Value {
    return this.generateDefault(type, rule);
    // const fakerCandidates = FakerApi.fuse.search({ function: field });
    //
    // if (!fakerCandidates.length) {
    //   this.generateDefault(type, rule);
    // }
    //
    // const match = fakerCandidates[0];
    // if (match.score && match.score >= 2) {
    //   this.generateDefault(type, rule);
    // }
    //
    // return match.item.callback(rule);
  }

  private generateDefault(type: NonArrayFieldType, rule?: Rule): Value {
    if (type in DEFAULT_FAKER_CANDIDATES) {
      return DEFAULT_FAKER_CANDIDATES[type](rule);
    }

    throw new Error(`No default faker found for type: ${type}`);
  }
}
