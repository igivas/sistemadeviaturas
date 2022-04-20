import { Router } from 'express';

import TokenController from '../controllers/TokenController';

const tokenRouter = Router();
const tokenController = new TokenController();

tokenRouter.post('/', tokenController.create);

export default tokenRouter;
