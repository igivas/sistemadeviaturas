import { Router } from 'express';
import SituacoesTiposController from '@modules/veiculos/controllers/SituacoesTiposController';

const situacoesTiposRouter = Router();

const situacoesTiposController = new SituacoesTiposController();

situacoesTiposRouter.get('/', situacoesTiposController.index);

export default situacoesTiposRouter;
