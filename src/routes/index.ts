import { Router } from 'express';

// import usersRouter from '@modules/users/routes/users.routes';
// import sessionsRouter from '@modules/users/routes/sessions.routes';
import veiculosRouter from '@modules/veiculos/routes/veiculos.routes';
import locaisRouter from '@modules/veiculos/routes/locais_externos.routes';
import referenciaPneuRouter from '@modules/veiculos/routes/referencia_pneus.routes';
import veiculosEspeciesRouter from '@modules/veiculos/routes/veiculos_especies.routes';
import veiculosCoresRouter from '@modules/veiculos/routes/veiculos_cores.routes';
import marcasRouter from '@modules/veiculos/routes/veiculos_marcas.routes';
import orgaosRouter from '@modules/veiculos/routes/orgaos.routes';
import sessionsRouter from '@modules/seg/routes/sessions.routes';
// import imagesRouter from '@modules/legado/routes/images.routes';

import situacaoPneuRouter from '@modules/veiculos/routes/situacoes_veiculos.routes';
import situacoesTiposRouter from '@modules/veiculos/routes/veiculos_situacoes_tipos.routes';
import estadosRouter from '@modules/veiculos/routes/estados.routes';
import veiculosMovimentacoesRouter from '@modules/veiculos/routes/veiculos_movimentacoes.routes';
import prefixoRouter from '@modules/veiculos/routes/prefixos.routes';
import documentosRouter from '@modules/veiculos/routes/documentos.routes';
import checkRouter from '@modules/veiculos/routes/check.route';
import unidadesRouter from '@modules/public/routes/unidades.routes';
import modelosRouter from '@modules/veiculos/routes/veiculos_modelos.routes';
import pneusRouter from '@modules/veiculos/routes/pneus.routes';
import emailsRouter from '@modules/veiculos/routes/emails.routes';
import oficinasRouter from '@modules/veiculos/routes/oficinas.routes';
import enderecosRouter from '@modules/public/routes/enderecoes.route';
import aquisicoesRouter from '@modules/veiculos/routes/aquisicoes.route';
import policiaisRouter from '../modules/public/routes/policiais.routes';

const routes = Router();

routes.use('/aquisicoes', aquisicoesRouter);
routes.use('/emails', emailsRouter);
routes.use('/movimentacoes', veiculosMovimentacoesRouter);
routes.use('/veiculos', veiculosRouter);
routes.use('/locais', locaisRouter);
routes.use('/referencias_pneus', referenciaPneuRouter);
routes.use('/situacoes_veiculos', situacaoPneuRouter);
routes.use('/situacoes_tipos', situacoesTiposRouter);
routes.use('/veiculos_especies', veiculosEspeciesRouter);
routes.use('/veiculos_cores', veiculosCoresRouter);
routes.use('/marcas', marcasRouter);
routes.use('/modelos', modelosRouter);
routes.use('/orgaos', orgaosRouter);
routes.use('/opms', unidadesRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/policiais', policiaisRouter);
routes.use('/estados', estadosRouter);
routes.use('/enderecos', enderecosRouter);
routes.use('/prefixos', prefixoRouter);
routes.use('/documentos', documentosRouter);
routes.use('/check', checkRouter);
routes.use('/pneus', pneusRouter);
routes.use('/oficinas', oficinasRouter);

export default routes;
