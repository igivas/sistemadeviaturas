import { Router } from 'express';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
import EmailsController from '../controllers/EmailsController';

const emailsRouter = Router();
const emailsController = new EmailsController();

emailsRouter.use(ensureAuthenticated);

emailsRouter.get('/', emailsController.index);
emailsRouter.post('/', emailsController.create);
emailsRouter.put('/:id', emailsController.update);

export default emailsRouter;
