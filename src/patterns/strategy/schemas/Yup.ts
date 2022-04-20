import { IValidationRules } from '@modules/veiculos/interfaces/validation/IValidationRules';
import * as Yup from 'yup';
import { injectable } from 'tsyringe';
import { ISchema } from './ISchema';

@injectable()
class YupValidation<T extends object> implements ISchema<T> {
  createSchema(rules: IValidationRules): Yup.ObjectSchema<T> {
    const formatedRules: Yup.ObjectSchemaDefinition<T, object> = rules.reduce(
      (object, rule) => {
        const { chave, yup } = rule;

        return {
          ...object,
          [chave]:
            yup?.expression || yup?.arrayExpression || yup?.objectExpression,
        };
      },
      {} as Yup.ObjectSchemaDefinition<T, object>,
    );

    return Yup.object().shape(formatedRules) as Yup.ObjectSchema<T>;
  }

  concatSchema(
    actualSchema: Yup.ObjectSchema<T>,
    schemaToAppend: Yup.ObjectSchema<T>,
    chave: string,
  ): Yup.ObjectSchema<T> {
    const newSchema = Yup.object({
      [chave]: schemaToAppend,
    });

    return actualSchema.concat(newSchema as Yup.ObjectSchema<T>);
  }

  async validateData(schema: Yup.ObjectSchema<T>, values: unknown): Promise<T> {
    const removedUnknowValues = schema.cast(values, {
      stripUnknown: true,
    });

    return schema.validate(removedUnknowValues, {
      abortEarly: false,
    });
  }
}

export default YupValidation;
