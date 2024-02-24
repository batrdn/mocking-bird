import micromatch from 'micromatch';
import { CorePathFinder } from './core-path-finder';
import { FieldPath } from '../types';

/**
 * ### Overview
 *
 * GlobPathFinder is a concrete implementation of CorePathFinder, and it uses a select glob patterns to match paths.
 *
 * @see https://en.wikipedia.org/wiki/Glob_(programming)
 *
 * @inheritDoc
 * @override
 * @remarks
 *
 * Currently, it supports the following glob patterns:
 *
 * - `*` matches any immediate child field name. For example, `a.*` matches `a.b` and `a.c` but not `a.b.c`.
 * - `**` matches any descendant field name. For example, `a.**.c` matches `a.b.c` and `a.b.d.c`.
 *
 * `*` could also be used match remaining characters in a field name.
 * For example, `field.is*` matches `field.isString` and `field.isNumber` etc...
 */
export class GlobPathFinder extends CorePathFinder {
  /**
   * Alphanumeric characters and wildcards are allowed in the path.
   *
   * Matches paths like `a.b.c` or `a.b.c.d`.
   * Matches patterns like `a.b.*` or `a.**.c`.
   *
   * @private
   */
  private static readonly PATH_REGEX = /^[a-zA-Z0-9_*]+(?:\.[a-zA-Z0-9_*]+)*$/;
  static readonly DELIMITER = '.';

  /**
   * Creates a path by joining the root path and the sub path.
   * The delimiter is a period (`.`).
   *
   * @example
   * const rootPath = 'a';
   * const subPath = 'b';
   * const result = globPathFinder.createPath(rootPath, subPath);
   * console.log(result); // Output: 'a.b'
   *
   * @inheritDoc
   * @override
   */
  override createPath(rootPath: FieldPath, subPath: FieldPath): string {
    return `${rootPath}${GlobPathFinder.DELIMITER}${subPath}`;
  }

  /**
   * Finds the patterns that match the given path.
   *
   * @example
   * const path = 'a.b.c';
   * const patterns = ['a.b.*', 'a.**.c'];
   * const result = globPathFinder.findPatterns(path, patterns);
   * console.log(result); // Output: ['a.b.*']
   *
   * @inheritDoc
   * @override
   */
  override findPatterns(path: FieldPath, patterns: string[]): string[] {
    return patterns.filter((pattern) => micromatch.isMatch(path, pattern));
  }

  /**
   * Checks if the given path exists in the patterns.
   *
   * @example
   * const pathToFind = 'a.b.c';
   * const patterns = ['a.b.*', 'a.**.c'];
   * const result = globPathFinder.exists(pathToFind, patterns);
   * console.log(result); // Output: true
   *
   * @inheritDoc
   * @override
   */
  override exists(pathToFind: FieldPath, patterns: string[]): boolean {
    return micromatch.isMatch(pathToFind, patterns);
  }

  /**
   * Checks if the given path is a valid path.
   *
   * @example
   * const path = 'a.b.c';
   * const result = globPathFinder.isValidPath(path);
   * console.log(result); // Output: true
   *
   * const invalidPath = 'a/b/c';
   * const invalidResult = globPathFinder.isValidPath(invalidPath);
   * console.log(invalidResult); // Output: false
   *
   * @inheritDoc
   * @override
   */
  override isValidPath(path: FieldPath): boolean {
    return GlobPathFinder.PATH_REGEX.test(path);
  }

  /**
   * Validates the given paths.
   *
   * @example
   * const paths = ['a.b.c', 'a.b.d'];
   * globPathFinder.validatePaths(paths);
   *
   * @inheritDoc
   * @override
   *
   * @throws {Error} If the path is invalid.
   */
  override validatePaths(paths: FieldPath[]): void {
    paths.forEach((path) => {
      if (!this.isValidPath(path)) {
        throw new Error(`Invalid path: ${path}`);
      }
    });
  }

  /**
   * Extracts the field name from the given path.
   * The field name is the last part of the path.
   *
   * @example
   * const path = 'a.b.c';
   * const result = globPathFinder.extractFieldName(path);
   * console.log(result); // Output: 'c'
   *
   * @inheritDoc
   * @override
   *
   * @throws {Error} If the path is not separated by the delimiter or is invalid.
   */
  override extractFieldName(path: FieldPath): string {
    const relevantPath = path.split('.').pop();
    if (!relevantPath) {
      throw new Error(`Invalid path: ${path}`);
    }

    return relevantPath;
  }
}
