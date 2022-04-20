import { IValidationRules } from '@modules/veiculos/schemas/rules/IValidationRules';
import { IDriverValidationContextFormat } from '../../interfaces/drivers/IDriverContextValidationFormat';

export interface ISchema<T extends object> {
  createSchema: (rules: IValidationRules) => IDriverValidationContextFormat<T>;
  validateData: (
    schema: IDriverValidationContextFormat<T>,
    values: unknown,
  ) => Promise<T>;
  concatSchema: (
    actualSchema: IDriverValidationContextFormat<T>,
    schemaToAppend: IDriverValidationContextFormat<T>,
    chave: string,
  ) => IDriverValidationContextFormat<T>;
}
