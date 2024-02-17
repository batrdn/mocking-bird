import { NonArrayFieldType, Rule, Value } from '../types';
import { FakerContext } from './faker-context';

export class FakerApi {
  generate(
    field: string,
    type: NonArrayFieldType,
    rule?: Rule,
    useSmartSearch = true
  ): Value {
    if (!useSmartSearch) {
      return this.generateDefault(type, rule);
    }

    const callback = FakerContext.getInstance().findCallback(field);

    if (callback) {
      const value = callback(rule);

      // TODO: validate and coerce types

      return value;
    }

    return this.generateDefault(type, rule);
  }

  private generateDefault(type: NonArrayFieldType, rule?: Rule): Value {
    const callback = FakerContext.getInstance().getDefaultCallback(type);

    return callback(rule);
  }
}
