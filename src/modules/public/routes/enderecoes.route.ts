import { Router } from 'express';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
import EnderecosController from '../controllers/EnderecosController';

const enderecosRouter = Router();
const enderecosController = new EnderecosController();

enderecosRouter.use(ensureAuthenticated);
enderecosRouter.get('/', enderecosController.index);

export default enderecosRouter;
