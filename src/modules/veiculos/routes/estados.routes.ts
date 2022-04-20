import { Router } from 'express';
import EstadosController from '../controllers/EstadosController';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';

const estadosRouter = Router();
const estados = new EstadosController();

estadosRouter.use(ensureAuthenticated);

estadosRouter.get('/', estados.index);

export default estadosRouter;
