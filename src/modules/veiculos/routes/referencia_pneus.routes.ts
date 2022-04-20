import { Router } from 'express';
import validateSchema from '../../../middlewares/ensureValidatedFields';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
import PneusController from '../controllers/PneusController';
import { pneusSchema } from '../schemas/schemaContext';

const referenciaPneuRouter = Router();
const referenciaPneu = new PneusController();

referenciaPneuRouter.use(ensureAuthenticated);

referenciaPneuRouter.get('/', referenciaPneu.index);
referenciaPneuRouter.post(
  '/',
  validateSchema([
    {
      schema: pneusSchema,
    },
  ]),
  referenciaPneu.create,
);

// referenciaPneuRouter.get('/:id', referenciaPneu.show);
// referenciaPneuRouter.put('/:id', referenciaPneu.update);
// referenciaPneuRouter.delete('/:id', referenciaPneu.delete);

export default referenciaPneuRouter;
