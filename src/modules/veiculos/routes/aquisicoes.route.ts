import { Router } from 'express';
import { storage } from '@config/upload';
import validateSchema from '../../../middlewares/ensureValidatedFields';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
import AquisicoesController from '../controllers/AquisicoesController';
import { aquisicaoSchema } from '../schemas/schemaContext';

const aquisicoesRouter = Router();
const aquisicoesController = new AquisicoesController();

aquisicoesRouter.use(ensureAuthenticated);

aquisicoesRouter.put(
  '/:id',
  storage.single('aquisicao_file'),
  validateSchema([{ schema: aquisicaoSchema }]),
  aquisicoesController.update,
);

export default aquisicoesRouter;
