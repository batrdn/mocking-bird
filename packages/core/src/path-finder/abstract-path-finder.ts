export abstract class AbstractPathFinder {
  abstract find(
    pathToFind: string,
    paths: string[]
  ): string[];

  abstract exists(pathToFind: string, paths: string[]): boolean;
}
