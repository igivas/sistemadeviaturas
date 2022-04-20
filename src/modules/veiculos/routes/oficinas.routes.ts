import { Router } from 'express';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
import validateSchema from '../../../middlewares/ensureValidatedFields';
import OficinasController from '../controllers/OficinasController';
import { oficinaSchema } from '../schemas/schemaContext';

const oficinasRouter = Router();
const oficinasController = new OficinasController();

oficinasRouter.use(ensureAuthenticated);

oficinasRouter.get('/', oficinasController.index);
oficinasRouter.post(
  '/',
  validateSchema([{ schema: oficinaSchema }]),
  oficinasController.create,
);
oficinasRouter.get('/matriz', oficinasController.indexMatriz);

export default oficinasRouter;
