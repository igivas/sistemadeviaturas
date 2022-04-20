import { Router } from 'express';
import PneusController from '@modules/veiculos/controllers/PneusController';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';

const pneusRouter = Router();

const pneusController = new PneusController();

pneusRouter.use(ensureAuthenticated);

pneusRouter.get('/', pneusController.index);
/*
veiculosRouter.post(
  '/',
  storage.single('aquisicao_file'),
  validateSchema(schemaCreateVeiculo),
  veiculosController.create,
);
veiculosRouter.get('/', veiculosController.index);

veiculosRouter.get('/:id', veiculosController.show);
veiculosRouter.put(
  '/:id',
  storage.single('aquisicao_file'),
  veiculosController.update,
);

veiculosRouter.post(
  '/:id/identificadores',
  validateSchema(createIdentificadorSchema),
  identificadoresController.create,
);
veiculosRouter.put('/identificadores/:id', identificadoresController.update);
veiculosRouter.delete('/identificadores/:id', identificadoresController.delete);
veiculosRouter.get('/:id/identificadores/', identificadoresController.index);

veiculosRouter.post(
  '/:id/movimentacoes',
  validateSchema(createMovimentacaoSchema),
  movimentacoesController.create,
);
veiculosRouter.put('/movimentacoes/:id', movimentacoesController.update);
veiculosRouter.delete('/movimentacoes/:id', movimentacoesController.delete);
veiculosRouter.get('/:id/movimentacoes/', movimentacoesController.index);

veiculosRouter.post('/:id/kms', kmsController.create);
veiculosRouter.put('/kms/:id', kmsController.update);
veiculosRouter.delete('/kms/:id', kmsController.delete);

veiculosRouter.post('/:id/prefixos', prefixosController.create);
veiculosRouter.get('/:id/prefixos', prefixosController.index);
veiculosRouter.put('/prefixos/:id', prefixosController.update);
veiculosRouter.delete('/prefixos/:id', prefixosController.delete);

veiculosRouter.get('/:id/solicitacoes', solicitacoes.index);
veiculosRouter.post('/:id/solicitacoes', solicitacoes.create);
veiculosRouter.put('/:id/solicitacoes/:idSolicitacao', solicitacoes.update);
veiculosRouter.post('/:id/solicitacoes/:idSolicitacao', solicitacoes.delete);

veiculosRouter.get('/:id/solicitacoes/fases', faseSolicitacao.index);
veiculosRouter.post('/:id/solicitacoes/fases', faseSolicitacao.create);
veiculosRouter.put(
  '/:id/solicitacoes/fases/:idSolicitacao/:idFase/',
  faseSolicitacao.update,
);
veiculosRouter.delete(
  '/:id/solicitacoes/fases/:idFase',
  faseSolicitacao.delete,
);

veiculosRouter.post(
  '/:id/situacoes',
  validateSchema(schemaCreateSituacao),
  situacoesController.create,
);
veiculosRouter.get('/:id/situacoes', situacoesController.index);
 */
export default pneusRouter;
