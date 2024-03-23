import { TreeHelper } from '../src/tree-helpers';

describe('TreeHelper', () => {
  it('should denormalize a tree', () => {
    const tree = {
      a: {
        b: {
          c: 'value',
        },
      },
    };

    const result = TreeHelper.denormalize(tree);

    expect(result).toEqual({
      'a.b.c': 'value',
    });
  });
});
