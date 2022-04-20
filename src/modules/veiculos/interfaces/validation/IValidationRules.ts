import * as Yup from 'yup';

export type IFields = {
  [key: string]: any;
};

export interface IValidationRule {
  chave: string;
  /* regex?: RegExp;
  tests?: [
    {
      errorMessage: string;
      test: (params: Test) => boolean;
    },
  ]; */
  yup?: {
    expression?:
      | Yup.StringSchema<string | null | undefined, object>
      | Yup.NumberSchema<number | null | undefined, object>
      | Yup.DateSchema<Date | null | undefined, object>
      | Yup.MixedSchema<any, object>
      | Yup.BooleanSchema;

    arrayExpression?:
      | Yup.ArraySchema<{ [key: string]: any }, object>
      | Yup.NotRequiredArraySchema<{ [key: string]: any }, object>
      | Yup.ArraySchema<string, object>
      | Yup.ArraySchema<number, object>;

    objectExpression?: Yup.ObjectSchema<object | undefined>;
  };
}

export type IValidationRules = Array<IValidationRule>;
