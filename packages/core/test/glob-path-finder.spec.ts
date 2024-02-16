import { GlobPathFinder } from '../src';

describe('GlobPathFinder', () => {
  const globPathFinder = new GlobPathFinder();

  describe('Find method', () => {
    it('should match simple patterns', () => {
      const path = 'foo.bar.baz';
      const patterns = ['foo.bar.baz', 'foo.bar.qux', 'foo.qux.baz'];

      const result = globPathFinder.findPatterns(path, patterns);
      expect(result).toEqual(['foo.bar.baz']);
    });

    it('should match wildcard pattern', () => {
      const pathToFind = 'foo.bar.baz';
      const paths = ['foo.*.baz', 'foo.bar.qux'];

      const result = globPathFinder.findPatterns(pathToFind, paths);
      expect(result).toEqual(['foo.*.baz']);
    });

    it('should match double wildcard pattern', () => {
      const pathToFind = 'foo.1.2.3.baz';
      const paths = [
        'foo.**.baz',
        'foo.bar',
        'bar.foo.1.2.3.baz',
        'bar.foo',
        'foo.baz',
      ];

      const result = globPathFinder.findPatterns(pathToFind, paths);
      expect(result).toEqual(['foo.**.baz']);
    });

    it('should match question mark expression', () => {
      const pathToFind = 'foo.bar.baz';

      const paths = ['foo.bar.ba?', 'foo.**.bax', 'foo.*.qux', 'foo.qux.baz'];

      const result = globPathFinder.findPatterns(pathToFind, paths);
      expect(result).toEqual(['foo.bar.ba?']);
    });

    it('should not match anything', () => {
      const path = 'foo.bar.baz';
      const patterns = [
        'foo.bar.qux',
        'foo.qux.baz',
        'foo.**.qux',
        'fo?.**.qux',
      ];

      const result = globPathFinder.findPatterns(path, patterns);
      expect(result).toHaveLength(0);
    });
  });

  describe('Exists method', () => {
    it('should return true', () => {
      const pathToFind = 'foo.qux.baz';
      const patterns = ['foo.**.baz', 'foo.*.qux', 'foo.qux.baz'];

      const result = globPathFinder.exists(pathToFind, patterns);
      expect(result).toBe(true);
    });

    it('should return false', () => {
      const pathToFind = 'foo.bar.baz';
      const patterns = ['foo.**.qux', 'foo.qux.baz'];

      const result = globPathFinder.exists(pathToFind, patterns);
      expect(result).toBe(false);
    });
  });

  describe('Valid path method', () => {
    it('should return true', () => {
      const path = 'foo.bar123.baz';

      const result = globPathFinder.isValidPath(path);
      expect(result).toBe(true);
    });

    it('should return false', () => {
      const path = 'foo.bar/baz';

      const result = globPathFinder.isValidPath(path);
      expect(result).toBe(false);
    });

    it('should also match single part', () => {
      expect(globPathFinder.isValidPath('foo')).toBe(true);
    });

    it('should validate paths', () => {
      expect(() => {
        globPathFinder.validatePaths(['foo', 'bar', 'foo.bar']);
      }).not.toThrow();

      expect(() => {
        globPathFinder.validatePaths(['foo#$']);
      }).toThrow();
    });
  });
});
