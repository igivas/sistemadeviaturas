import { ObjectSchema } from 'yup';

export type IDriverValidationContextFormat<T extends object> = ObjectSchema<T>;
