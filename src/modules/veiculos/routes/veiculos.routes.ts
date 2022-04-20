import { Router } from 'express';
import VeiculosController from '@modules/veiculos/controllers/VeiculosController';
import IdentificadoresController from '@modules/veiculos/controllers/IdentificadoresController';
import KmsController from '@modules/veiculos/controllers/KmsController';
import MovimentacoesController from '@modules/veiculos/controllers/MovimentacoesController';
import PrefixosController from '@modules/veiculos/controllers/PrefixosController';
import SituacoesController from '@modules/veiculos/controllers/SituacoesVeiculosController';
import validateSchema from '../../../middlewares/ensureValidatedFields';
import { storage } from '../../../config/upload';
import SolicitacoesPneusController from '../controllers/SolicitacoesPneusController';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
import validationContext from '../../../contexts/validationContext';
import {
  veiculoSchema,
  aquisicaoSchema,
  identificadorSchema,
  situacaoSchema,
  prefixoSchema,
  putVeiculoSchema,
  movimentacaoSchema,
  kmSchema,
  movimentacaoManutencaoSchema,
  movimentacaoEmprestimoSchema,
} from '../schemas/schemaContext';
import AppError from '../../../errors/AppError';
import EPerfil from '../enums/EPerfil';
import AquisicoesController from '../controllers/AquisicoesController';

const veiculosRouter = Router();

const veiculosController = new VeiculosController();
const identificadoresController = new IdentificadoresController();
const kmsController = new KmsController();
const movimentacoesController = new MovimentacoesController();
const prefixosController = new PrefixosController();
const situacoesController = new SituacoesController();
const solicitacoes = new SolicitacoesPneusController();
const aquisicoesController = new AquisicoesController();

const veiculoValidation = validationContext.concatSchema(
  veiculoSchema,
  aquisicaoSchema,
  'aquisicao',
);

// veiculosRouter.use(ensureAuthorization([EPerfil.Administrador]));

veiculosRouter.get(
  '/anos_fabricacao',
  ensureAuthenticated,
  veiculosController.findAnosFabricacao,
);

veiculosRouter.post(
  '/',
  ensureAuthenticated,
  storage.single('aquisicao_file'),
  validateSchema([
    {
      schema: aquisicaoSchema,
      fieldReference: 'aquisicao',
    },
    {
      schema: identificadorSchema,
      fieldReference: 'identificador',
    },
    {
      schema: veiculoValidation,
    },
  ]),
  veiculosController.create,
);
veiculosRouter.get('/', veiculosController.index);

veiculosRouter.get(
  '/localizacoes',
  ensureAuthenticated,
  veiculosController.findVeiculosLocalizacoes,
);

veiculosRouter.get(
  '/:id/aquisicoes',
  ensureAuthenticated,
  aquisicoesController.showByIdVeiculo,
);
veiculosRouter.post(
  '/:id/aquisicoes',
  ensureAuthenticated,
  storage.single('aquisicao_file'),
  validateSchema([{ schema: aquisicaoSchema }]),
  aquisicoesController.create,
);

veiculosRouter.get('/:id', veiculosController.show);
veiculosRouter.put(
  '/:id',
  ensureAuthenticated,
  validateSchema([{ schema: putVeiculoSchema }]),
  veiculosController.update,
);

veiculosRouter.get(
  '/:id/carga',
  ensureAuthenticated,
  movimentacoesController.carga,
);

veiculosRouter.post(
  '/:id/identificadores',
  ensureAuthenticated,
  validateSchema([{ schema: identificadorSchema }]),
  identificadoresController.create,
);
veiculosRouter.put(
  '/identificadores/:id',
  ensureAuthenticated,
  identificadoresController.update,
);
veiculosRouter.delete(
  '/identificadores/:id',
  ensureAuthenticated,
  identificadoresController.delete,
);
veiculosRouter.get('/:id/identificadores/', identificadoresController.index);

veiculosRouter.post(
  '/:id/movimentacoes',
  ensureAuthenticated,
  storage.single('movimentacao_file'),
  (request, response, next) => {
    if (
      request.file &&
      request.user.perfis.findIndex(
        perfil =>
          perfil.id_perfil === EPerfil.Administrador ||
          perfil.id_perfil === EPerfil['Super Administrador'],
      ) < 0
    )
      throw new AppError(
        'Usuário não possui nivel para enviar este formato de arquivo',
      );

    return next();
  },
  validateSchema([
    {
      schema: movimentacaoSchema,
    },
    { schema: movimentacaoManutencaoSchema },
    { schema: movimentacaoEmprestimoSchema },
  ]),
  movimentacoesController.create,
);
veiculosRouter.put('/movimentacoes/:id', movimentacoesController.update);
veiculosRouter.delete('/movimentacoes/:id', movimentacoesController.delete);
veiculosRouter.get('/:id/movimentacoes/', movimentacoesController.index);

veiculosRouter.post(
  '/:id/kms',
  validateSchema([{ schema: kmSchema }]),
  kmsController.create,
);
veiculosRouter.get('/:id/kms', kmsController.index);
veiculosRouter.put('/kms/:id', kmsController.update);
veiculosRouter.delete('/kms/:id', kmsController.delete);

veiculosRouter.post(
  '/:id/prefixos',
  validateSchema([{ schema: prefixoSchema }]),
  prefixosController.create,
);
veiculosRouter.get('/:id/prefixos', prefixosController.index);
veiculosRouter.put('/prefixos/:id', prefixosController.update);
veiculosRouter.delete('/prefixos/:id', prefixosController.delete);

veiculosRouter.get('/:id/solicitacoes', solicitacoes.index);
veiculosRouter.post('/:id/solicitacoes', solicitacoes.create);
veiculosRouter.put('/:id/solicitacoes/:idSolicitacao', solicitacoes.update);
veiculosRouter.post('/:id/solicitacoes/:idSolicitacao', solicitacoes.delete);

veiculosRouter.post(
  '/:id/situacoes',
  ensureAuthenticated,
  validateSchema([{ schema: situacaoSchema }]),
  situacoesController.create,
);
veiculosRouter.get('/:id/situacoes', situacoesController.index);

export default veiculosRouter;
