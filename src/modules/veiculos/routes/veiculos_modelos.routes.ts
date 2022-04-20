import { Router } from 'express';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
import validateSchema from '../../../middlewares/ensureValidatedFields';
import ModelosController from '../controllers/ModelosController';
import { veiculoModeloSchema } from '../schemas/schemaContext';

const modelosRouter = Router();
const modelosController = new ModelosController();

modelosRouter.use(ensureAuthenticated);

modelosRouter.get('/', modelosController.index);
modelosRouter.get('/list', modelosController.list);

modelosRouter.post(
  '/',
  validateSchema([{ schema: veiculoModeloSchema }]),
  modelosController.create,
);

modelosRouter.put('/:id', modelosController.update);

export default modelosRouter;
