import { Router } from 'express';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';

const prefixoRouter = Router();

prefixoRouter.use(ensureAuthenticated);

export default prefixoRouter;
