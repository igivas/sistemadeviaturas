import { uploadFolder } from '@config/upload';
import { Router, static as staticFiles } from 'express';
import cors from 'cors';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
import validateSchema from '../../../middlewares/ensureValidatedFields';
import DocumentosController from '../controllers/DocumentosController';
import { documentoMovimentacaoSchema } from '../schemas/schemaContext';

const documentosRouter = Router();
const documentosController = new DocumentosController();

documentosRouter.use(
  cors({
    exposedHeaders: ['Content-Disposition'],
  }),
);

documentosRouter.use(ensureAuthenticated);
documentosRouter.post(
  '/',
  validateSchema([
    { schema: documentoMovimentacaoSchema, fieldReference: 'movimentacao' },
  ]),
  documentosController.create,
);
documentosRouter.use('/', staticFiles(uploadFolder));

documentosRouter.delete('/', documentosController.delete);

documentosRouter.post('/create_pin', documentosController.generatePin24h);

export default documentosRouter;
