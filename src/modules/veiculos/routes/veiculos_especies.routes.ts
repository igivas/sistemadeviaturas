import { Router } from 'express';
import VeiculosEspeciesController from '@modules/veiculos/controllers/VeiculosEspeciesController';

const veiculosEspeciesRouter = Router();

const veiculosEspeciesController = new VeiculosEspeciesController();

veiculosEspeciesRouter.get('/', veiculosEspeciesController.index);
veiculosEspeciesRouter.get('/:id', veiculosEspeciesController.show);
veiculosEspeciesRouter.post('/', veiculosEspeciesController.create);
veiculosEspeciesRouter.put('/:id', veiculosEspeciesController.update);

export default veiculosEspeciesRouter;
