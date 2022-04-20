import { Router } from 'express';
import MarcasModelosController from '../controllers/MarcasModelosControllers';
import VeiculosMarcasController from '../controllers/VeiculosMarcasController';

const marcasRouter = Router();
const marcasVeiculos = new VeiculosMarcasController();
const modelosVeiculos = new MarcasModelosController();

marcasRouter.get('/', marcasVeiculos.index);
marcasRouter.get('/:id', marcasVeiculos.show);

marcasRouter.post('/', marcasVeiculos.create);
marcasRouter.put('/:id', marcasVeiculos.update);

marcasRouter.delete('/:id', marcasVeiculos.delete);

marcasRouter.get('/:id/modelos', modelosVeiculos.index);
// marcasRouter.get('/modelos/:idModelo', modelosVeiculos.show);

// marcasRouter.post('/modelos', modelosVeiculos.create);
// marcasRouter.put('/modelos/:idModelo', modelosVeiculos.update);

// marcasRouter.delete('/modelos/:idModelo', modelosVeiculos.delete);
export default marcasRouter;
