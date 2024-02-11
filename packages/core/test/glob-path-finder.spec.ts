import { GlobPathFinder } from '../src';

describe('GlobPathFinder', () => {
  const globPathFinder = new GlobPathFinder();

  describe('Find method', () => {
    it('should match simple expression', () => {
      const pathToFind = 'foo.bar.baz';
      const paths = ['foo.bar.baz', 'foo.bar.qux', 'foo.qux.baz'];

      const result = globPathFinder.find(pathToFind, paths);
      expect(result).toEqual(['foo.bar.baz']);
    });

    it('should match wildcard expression', () => {
      const pathToFind = 'foo.*.baz';
      const paths = ['foo.bar.baz', 'foo.bar.qux', 'foo.qux.baz'];

      const result = globPathFinder.find(pathToFind, paths);
      expect(result).toEqual(['foo.bar.baz', 'foo.qux.baz']);
    });

    it('should match double wildcard expression', () => {
      const pathToFind = 'foo.**.baz';
      const paths = [
        'foo.1.2.3.baz',
        'foo.bar',
        'bar.foo.1.2.3.baz',
        'bar.foo',
        'foo.baz',
      ];

      const result = globPathFinder.find(pathToFind, paths);
      expect(result).toEqual(['foo.1.2.3.baz']);
    });

    it('should match question mark expression', () => {
      const pathToFind = 'foo.bar.ba?';

      const paths = [
        'foo.bar.baz',
        'foo.bar.bax',
        'foo.bar.qux',
        'foo.qux.baz',
      ];

      const result = globPathFinder.find(pathToFind, paths);
      expect(result).toEqual(['foo.bar.baz', 'foo.bar.bax']);
    });

    it('should not match anything', () => {
      const pathToFind = 'foo.bar.baz';
      const paths = ['foo.bar.qux', 'foo.qux.baz'];

      const result = globPathFinder.find(pathToFind, paths);
      expect(result).toHaveLength(0);
    });
  });

  describe('Exists method', () => {
    it('should return true', () => {
      const pathToFind = 'foo.*.baz';
      const paths = ['foo.bar.baz', 'foo.bar.qux', 'foo.qux.baz'];

      const result = globPathFinder.exists(pathToFind, paths);
      expect(result).toBe(true);
    });

    it('should return false', () => {
      const pathToFind = 'foo.bar.baz';
      const paths = ['foo.bar.qux', 'foo.qux.baz'];

      const result = globPathFinder.exists(pathToFind, paths);
      expect(result).toBe(false);
    });
  });
});
