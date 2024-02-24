import { FieldPath, Rule } from '../types';

/**
 * ### Overview
 *
 * CorePathFinder is an abstract class that provides the basic functionality for path and pattern operations.
 *
 * @virtual
 * @remarks
 *
 * ### What is a path?
 *
 * A path is either a single field name or a sequence of joined field names (in nested data structures).
 * It is the concrete representation of a field in a data structure.
 * For example, `address.street` is a path that represents the `street` field under the `address` field.
 * It may also be as simple as single field name like `age` or `name`.
 *
 * ### What is a pattern?
 *
 * A pattern is a generic representation of paths. It can be a single field name or a sequence of joined field names.
 * It may also contain wildcards or special characters for searching and matching paths.
 * For example, `address.*` is a pattern that matches all fields under the `address` field.
 *
 * Note: The path and pattern may be used interchangeably in the context of this library.
 * For example, in the context of rules, the path may be used to represent either a path or a pattern.
 * The same applies to paths in override values and fixture options.
 */
export abstract class CorePathFinder {
  /**
   * Creates a path by joining the root path and the sub path.
   *
   * @virtual
   *
   * @param rootPath The root path.
   * @param subPath The sub path.
   *
   * @returns The joined path.
   */
  abstract createPath(rootPath: FieldPath, subPath: string): string;

  /**
   * Finds the patterns that match the given path.
   *
   * @virtual
   *
   * @param path The path to match.
   * @param patterns The patterns to match against.
   *
   * @returns The matching patterns found from the path.
   */
  abstract findPatterns(path: FieldPath, patterns: string[]): string[];

  /**
   * Checks if the given path exists in the patterns.
   *
   * @virtual
   *
   * @param path The path to find.
   * @param patterns The patterns to search.
   *
   * @returns `true` if the path exists in the patterns, otherwise `false`.
   */
  abstract exists(path: FieldPath, patterns: string[]): boolean;

  /**
   * Checks if the given path is a valid path.
   *
   * @virtual
   *
   * @param path The path to validate.
   *
   * @returns `true` if the path is valid, otherwise `false`.
   */
  abstract isValidPath(path: FieldPath): boolean;

  /**
   * Validates the given paths.
   *
   * @virtual
   *
   * @param paths The paths to validate.
   *
   * @throws {Error} If the path is invalid.
   */
  abstract validatePaths(paths: FieldPath[]): void;

  /**
   * Extracts the field name from the given path.
   *
   * @virtual
   *
   * @param path The path to extract the field name from.
   *
   * @returns The extracted field name.
   */
  abstract extractFieldName(path: FieldPath): string;

  /**
   * Finds the rule that matches the given path.
   *
   * @param path The path to find the rule for.
   * @param rules The rules from which the paths will be searched.
   *
   * @returns The rule that matches the given path, otherwise `undefined`.
   *
   * @throws {Error} If multiple rules are found for the given path.
   */
  findRule(path: FieldPath, rules: Rule[] | undefined): Rule | undefined {
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
