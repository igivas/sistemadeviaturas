import { IDriverValidationContextFormat } from '../drivers/IDriverContextValidationFormat';

export type IEnsureValidated = {
  schema: IDriverValidationContextFormat<object>;
  fieldReference?: string;
};
