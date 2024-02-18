import {Rule} from "../types";

export abstract class AbstractPathFinder {
  abstract createPath(rootPath: string, subPath: string): string;

  abstract findPatterns(path: string, patterns: string[]): string[];

  abstract exists(path: string, patterns: string[]): boolean;

  abstract isValidPath(path: string): boolean;

  abstract validatePaths(paths: string[]): void;

  findRule(
    path: string,
    rules: Rule[] | undefined
  ): Rule | undefined {
    if (!rules) {
      return undefined;
    }

    const rulePaths = rules.map(({ path }) => path);
    const matchingPatterns = this.findPatterns(path, rulePaths);

    if (matchingPatterns.length === 0) {
      return undefined;
    }

    if (matchingPatterns.length > 1) {
      throw new Error(
        `Forbidden: multiple rules found for path '${path}': ${matchingPatterns.join(
          ', '
        )}`
      );
    }

    const pattern = matchingPatterns[0];

    return rules.find((rule) => rule.path === pattern);
  }
}
