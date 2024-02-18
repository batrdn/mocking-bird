import Fuse from 'fuse.js';
import { FakerCandidate, NonArrayFieldType } from '@mocking-bird/core';
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

export class FakerFinder {
  private fuseMap: Map<NonArrayFieldType, Fuse<FakerCandidate>>;

  constructor() {
    this.fuseMap = this.createFuseMap(this.buildFakerCandidates());
  }

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
