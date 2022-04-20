import { Router } from 'express';
import SituacoesVeiculosController from '../controllers/SituacoesVeiculosController';

const situacaoPneuRouter = Router();
const situacaoPneu = new SituacoesVeiculosController();

situacaoPneuRouter.post('/', situacaoPneu.create);

export default situacaoPneuRouter;
