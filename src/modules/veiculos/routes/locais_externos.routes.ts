import { Router } from 'express';
import LocaisExternosController from '@modules/veiculos/controllers/LocaisExternosController';

const locaisRouter = Router();

const locaisExternosController = new LocaisExternosController();

locaisRouter.get('/', locaisExternosController.index);
locaisRouter.get('/:id', locaisExternosController.show);
locaisRouter.post('/', locaisExternosController.create);
locaisRouter.put('/:id', locaisExternosController.update);
locaisRouter.delete('/:id', locaisExternosController.delete);

export default locaisRouter;
