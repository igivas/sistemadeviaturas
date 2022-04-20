import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import { ISchema } from './ISchema';
import { IDriverValidationContextFormat } from '../../../interfaces/drivers/IDriverContextValidationFormat';

class Context<T extends object> implements ISchema<T> {
  private strategy: ISchema<T>;

  public setStrategy(strategy: ISchema<T>): void {
    this.strategy = strategy;
  }

  public getStrategy(): ISchema<T> {
    return this.strategy;
  }

  createSchema(rules: IValidationRules): IDriverValidationContextFormat<T> {
    return this.strategy.createSchema(rules);
  }

  concatSchema(
    actualSchema: IDriverValidationContextFormat<T>,
    schemaToAppend: IDriverValidationContextFormat<T>,
    chave: string,
  ): IDriverValidationContextFormat<T> {
    return this.strategy.concatSchema(actualSchema, schemaToAppend, chave);
  }

  async validateData(
    schema: IDriverValidationContextFormat<T>,
    values: unknown,
  ): Promise<T> {
    return this.strategy.validateData(schema, values);
  }
}

export default Context;
