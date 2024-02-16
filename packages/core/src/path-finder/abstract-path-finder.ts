export abstract class AbstractPathFinder {
  abstract createPath(rootPath: string, subPath: string): string;

  abstract findPatterns(path: string, patterns: string[]): string[];

  abstract exists(path: string, patterns: string[]): boolean;

  abstract isValidPath(path: string): boolean;

  abstract validatePaths(paths: string[]): void;
}
