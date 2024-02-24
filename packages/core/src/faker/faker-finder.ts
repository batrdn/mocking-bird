import Fuse from 'fuse.js';
import { FakerCandidate, NonArrayFieldType } from '../types';
import {
  AirlineModule,
  AnimalModule,
  CommerceModule,
  CompanyModule,
  DateModule,
  FinanceModule,
  ImageModule,
  InternetModule,
  LocationModule,
  MusicModule,
  NumberModule,
  PersonModule,
  PhoneModule,
  ScienceModule,
  SystemModule,
  VehicleModule,
  WordModule,
} from './modules';

/**
 * ### Overview
 *
 * A class that provides the functionality to search for faker candidates.
 * It uses the fuse.js library to search for the best match based on the field name and type.
 *
 * @remarks
 *
 * ### The Main Reason
 *
 * The main reason for this class is to provide a way to generate accurate data for a given field or property name.
 * Since faker.js is used in this library to generate fake data, it is important to find the best match for a given
 * field name from a wide range of methods which faker.js provides.
 *
 * For example, if the given field name is `address`, we would want to use `faker.location.street()` to generate a
 * fake street address.
 *
 * But what if the field name is `homeAddress` or `workAddress`? In this case, we would still want to use the same
 * method, but there must be a mechanism to match the given field name to the name of the method provided by faker.js.
 * Therefore, here we use fuzzy searching or approximate string matching to find the best match for a given field name.
 *
 * ### Scoring
 *
 * A list of best matches is provided with their scores. The best match has the score of 0, and the worst match has the
 * score of 1. We consider a match to be suitable if it matches at least 50% accurately {@link FakerContext.SEARCH_SCORE_THRESHOLD}.
 * The fuzziness score is calculated based on how far the given field name is from the faker method name using a
 * modified implementation of [Bitap algorithm](https://en.wikipedia.org/wiki/Bitap_algorithm).
 *
 * For more information on fuse.js and fuzziness score, see the [fuse.js documentation](https://fusejs.io/).
 */
export class FakerFinder {
  // The map that holds the fuse instances for each type, e.g., string, number, date etc...
  private fuseMap: Map<NonArrayFieldType, Fuse<FakerCandidate>>;

  constructor() {
    this.fuseMap = this.createFuseMap(this.buildFakerCandidates());
  }

  /**
   * Searches for the best faker candidate based on the field name and type.
   *
   * @param fieldName The field name to search for the best match.
   * @param type The type of the field, e.g., string, number, date etc...
   *
   * @returns A list of best faker candidates with their scores.
   *
   * @public
   */
  search(
    fieldName: string,
    type: NonArrayFieldType
  ): { faker: FakerCandidate; score?: number }[] {
    return (
      this.fuseMap
        .get(type)
        ?.search(fieldName)
        .map((candidate) => ({
          faker: candidate.item,
          score: candidate.score,
        })) ?? []
    );
  }

  /**
   * Creates a map of fuse instances for each field type.
   *
   * @param candidates The list of all faker candidates
   *
   * @returns A map of fuse instances for each field type
   *
   * @private
   */
  private createFuseMap(
    candidates: FakerCandidate[]
  ): Map<NonArrayFieldType, Fuse<FakerCandidate>> {
    const map = new Map<NonArrayFieldType, Fuse<FakerCandidate>>();

    const groupedCandidates = this.groupCandidatesByType(candidates);

    Object.entries(groupedCandidates).forEach(([type, candidates]) => {
      map.set(
        type as NonArrayFieldType,
        new Fuse(candidates, {
          includeScore: true,
          shouldSort: true,
          keys: ['method'],
        })
      );
    });

    return map;
  }

  /**
   * Groups the faker candidates by their type.
   * Each candidate comes with a specified type, e.g., string, number, date etc...
   *
   * @param candidates The list of all faker candidates
   *
   * @returns A key-value pair of field type and the list of faker candidates
   *
   * @private
   */
  private groupCandidatesByType(
    candidates: FakerCandidate[]
  ): Record<NonArrayFieldType, FakerCandidate[]> {
    return candidates.reduce((acc, candidate) => {
      if (!acc[candidate.type]) {
        acc[candidate.type] = [];
      }

      acc[candidate.type].push(candidate);

      return acc;
    }, {} as Record<NonArrayFieldType, FakerCandidate[]>);
  }

  /**
   * Builds a list of all faker candidates from all the modules.
   *
   * @returns A list of all faker candidates
   *
   * @private
   */
  private buildFakerCandidates(): FakerCandidate[] {
    const airline = new AirlineModule();
    const animal = new AnimalModule();
    const commerce = new CommerceModule();
    const company = new CompanyModule();
    const finance = new FinanceModule();
    const image = new ImageModule();
    const internet = new InternetModule();
    const location = new LocationModule();
    const music = new MusicModule();
    const person = new PersonModule();
    const phone = new PhoneModule();
    const science = new ScienceModule();
    const system = new SystemModule();
    const vehicle = new VehicleModule();
    const word = new WordModule();
    const date = new DateModule();
    const number = new NumberModule();

    return [
      ...airline.toFakerCandidates(),
      ...animal.toFakerCandidates(),
      ...commerce.toFakerCandidates(),
      ...company.toFakerCandidates(),
      ...finance.toFakerCandidates(),
      ...image.toFakerCandidates(),
      ...internet.toFakerCandidates(),
      ...location.toFakerCandidates(),
      ...music.toFakerCandidates(),
      ...person.toFakerCandidates(),
      ...phone.toFakerCandidates(),
      ...science.toFakerCandidates(),
      ...system.toFakerCandidates(),
      ...vehicle.toFakerCandidates(),
      ...word.toFakerCandidates(),
      ...date.toFakerCandidates(),
      ...number.toFakerCandidates(),
    ];
  }
}
