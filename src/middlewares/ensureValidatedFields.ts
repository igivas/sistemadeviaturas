import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import YupValidation from '../patterns/strategy/schemas/Yup';
import Context from '../patterns/strategy/schemas/Context';
import { IEnsureValidated } from '../interfaces/middlewares/IEnsureValidate';

const validateSchema = (validationSchemas: IEnsureValidated[]) =>
  async function ensureValidatedFields(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const { body } = request.body;
    let values: Record<string, any>;

    if (typeof body === 'string') {
      values = JSON.parse(body.trim());
    } else values = { ...body };

    const yupValidation = container.resolve(YupValidation);

    const context = new Context();
    context.setStrategy(yupValidation);

    const validatedSchemasValues = await Promise.all(
      validationSchemas.map(async validationSchema => {
        return validationSchema.fieldReference
          ? context.validateData(
              validationSchema.schema,
              values[validationSchema.fieldReference],
            )
          : context.validateData(validationSchema.schema, values);
      }),
    );

    request.body = validatedSchemasValues.reduce(
      (newValues, validatedSchemaValue, index) => {
        return validationSchemas[index].fieldReference
          ? {
              ...newValues,
              [validationSchemas[index]
                .fieldReference as string]: validatedSchemaValue,
            }
          : {
              ...newValues,
              ...validatedSchemaValue,
            };
      },

      {},
    );

    next();
  };

export default validateSchema;
