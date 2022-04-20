import { Router } from 'express';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
import CheckController from '../controllers/CheckController';

const checkRouter = Router();
const checkController = new CheckController();

checkRouter.use(ensureAuthenticated);

checkRouter.get('/', checkController.check);

export default checkRouter;
