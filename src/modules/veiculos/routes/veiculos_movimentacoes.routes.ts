import { Router } from 'express';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
import MovimentacoesController from '../controllers/MovimentacoesController';

const veiculosMovimentacoesRouter = Router();

const movimentacoesController = new MovimentacoesController();

veiculosMovimentacoesRouter.use(ensureAuthenticated);

veiculosMovimentacoesRouter.get('/veiculos', movimentacoesController.index);

veiculosMovimentacoesRouter.get('/:id', movimentacoesController.show);
veiculosMovimentacoesRouter.delete('/:id', movimentacoesController.delete);

export default veiculosMovimentacoesRouter;
