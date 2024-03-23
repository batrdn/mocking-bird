import { readFileSync } from 'node:fs';

export const loadFixture = (
  filename: string,
): {
  variables: Record<string, unknown>[];
  data: Record<string, unknown>[];
} => {
  const fixtureContent = readFileSync(filename, 'utf-8');

  const fixture = JSON.parse(fixtureContent);

  return {
    variables: fixture.variables,
    data: fixture.data,
  };
};
