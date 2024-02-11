import { AbstractPathFinder } from './abstract-path-finder';
import * as micromatch from 'micromatch';

export class GlobPathFinder extends AbstractPathFinder {
  find(pathToFind: string, paths: string[]): string[] {
    return micromatch.match(paths, pathToFind);
  }

  exists(pathToFind: string, paths: string[]): boolean {
    return micromatch.some(paths, pathToFind);
  }
}
