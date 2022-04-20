import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import { MulterError } from 'multer';
import { ValidationError } from 'yup';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import helmet from 'helmet';
import AppError from './errors/AppError';
import routes from './routes';

// import './database';
import './container';

const app = express();
app.use(
  cors({
    exposedHeaders: ['Content-Disposition'],
  }),
);
app.use(express.json());
app.use(helmet());

app.use(routes);

app.use(
  (error: Error, resquest: Request, response: Response, _: NextFunction) => {
    console.log(error);

    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    if (error instanceof EntityNotFoundError) {
      return response.status(400).json({
        status: 'error',
        message: 'Não pode encontrar nenhum elemento com os dados fornecidos',
      });
    }

    if (error instanceof ValidationError) {
      const errors = error.inner.reduce((currentError, nextError) => {
        return {
          ...currentError,
          [nextError.path as string]: nextError.errors,
        };
      }, {});
      return response.status(400).json({ message: 'Validation fails', errors });
    }

    if (error instanceof MulterError) {
      return response.status(400).json({
        status: 'error',
        message: error.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

export default app;
