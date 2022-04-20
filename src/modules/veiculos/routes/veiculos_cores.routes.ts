import { Router } from 'express';
import VeiculosCoresController from '@modules/veiculos/controllers/VeiculosCoresController';

const veiculosCoresRouter = Router();

const veiculosCoresController = new VeiculosCoresController();

veiculosCoresRouter.get('/', veiculosCoresController.index);
veiculosCoresRouter.get('/:id', veiculosCoresController.show);
veiculosCoresRouter.post('/', veiculosCoresController.create);
veiculosCoresRouter.put('/:id', veiculosCoresController.update);

export default veiculosCoresRouter;
