import { AbstractPathFinder } from './abstract-path-finder';
import micromatch from 'micromatch';

export class GlobPathFinder extends AbstractPathFinder {
  // Matches paths like `a.b.c` or `a.b.c.d`
  private static readonly PATH_REGEX = /^[a-zA-Z0-9_*?]+(?:\.[a-zA-Z0-9_*?]+)*$/;
  static readonly DELIMITER = '.';

  override createPath(rootPath: string, subPath: string): string {
    return `${rootPath}${GlobPathFinder.DELIMITER}${subPath}`;
  }

  override findPatterns(path: string, patterns: string[]): string[] {
    return patterns.filter((pattern) => micromatch.isMatch(path, pattern));
  }

  exists(pathToFind: string, patterns: string[]): boolean {
    return micromatch.isMatch(pathToFind, patterns);
  }

  isValidPath(path: string): boolean {
    return GlobPathFinder.PATH_REGEX.test(path);
  }

  validatePaths(paths: string[]): void {
    paths.forEach((path) => {
      if (!this.isValidPath(path)) {
        throw new Error(`Invalid path: ${path}`);
      }
    });
  }
}
