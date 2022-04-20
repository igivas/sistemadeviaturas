import { Router } from 'express';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
import PoliciaisController from '../controllers/PoliciaisController';
import PoliciaisEmailsController from '../controllers/PoliciaisEmailsController';
import PoliciaisTelefonesController from '../controllers/PoliciaisTelefonesController';
import PoliciaisEnderecosController from '../controllers/PoliciaisEnderecosController';
import ImagesController from '../controllers/ImagesController';

const policiaisRouter = Router();
const policiais = new PoliciaisController();
const policiaisEmails = new PoliciaisEmailsController();
const policiaisTelefones = new PoliciaisTelefonesController();
const policiaisEnderecos = new PoliciaisEnderecosController();
const imagesController = new ImagesController();

policiaisRouter.use(ensureAuthenticated);

policiaisRouter.get('/', policiais.index);
policiaisRouter.post('/emails', policiaisEmails.create);
policiaisRouter.delete('/emails/:id', policiaisEmails.delete);
policiaisRouter.post('/telefones', policiaisTelefones.create);
policiaisRouter.delete('/telefones/:id', policiaisTelefones.delete);
policiaisRouter.put('/telefones/:id', policiaisTelefones.update);
policiaisRouter.put('/enderecos/:id', policiaisEnderecos.update);
policiaisRouter.get('/enderecos/:id', policiaisEnderecos.show);
policiaisRouter.get('/:id/images', imagesController.show);
policiaisRouter.patch('/:id/images', async (request, response) => {
  return response.json({ ok: true });
});

export default policiaisRouter;
