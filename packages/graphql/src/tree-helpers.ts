import { FieldPath, Value } from '@mocking-bird/core';

export class TreeHelper {
  static denormalize<T>(tree: T): Record<FieldPath, Value> {
    const result: Record<FieldPath, Value> = {};

    const walk = (node: any, path: FieldPath | undefined) => {
      if (typeof node === 'object') {
        if (Array.isArray(node)) {
          node.forEach((value, index) => {
            walk(value, path ? `${path}.${index}` : index.toString());
          });
        } else {
          Object.entries(node).forEach(([key, value]) => {
            walk(value, path ? `${path}.${key}` : key);
          });
        }
      } else {
        result[path as FieldPath] = node;
      }
    };

    walk(tree, undefined);

    return result;
  }
}
