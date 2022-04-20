import { Router } from 'express';
import OrgaosController from '../controllers/OrgaosController';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';

const orgaosRouter = Router();
const orgaos = new OrgaosController();

orgaosRouter.use(ensureAuthenticated);

orgaosRouter.get('/', orgaos.index);
// orgaosRouter.post('/', orgaos.create);

// orgaosRouter.get('/:id', orgaos.show);
// orgaosRouter.put('/:id', orgaos.update);
// orgaosRouter.delete('/:id', orgaos.delete);

export default orgaosRouter;
