import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DelivererController from './app/controllers/DelivererController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';

import CarrierController from './app/controllers/CarrierController';

const routes = new Router();
const upload = multer(multerConfig);

// rota para autenticação
routes.post('/sessions', SessionController.store);

routes.get('/carriers/:id/deliveries', CarrierController.index);
routes.get('/carriers/:id/delivered', CarrierController.show);
routes.put('/carriers/:id/catch/', CarrierController.catch);
routes.put('/carriers/:id/drop/', CarrierController.drop);

// middleware garante que as demais rotas a seguir estejam acessíveis
// apenas para usuários autenticados
routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.get('/deliverers', DelivererController.index);
routes.post('/deliverers', DelivererController.store);
routes.put('/deliverers/:id', DelivererController.update);
routes.delete('/deliverers/:id', DelivererController.delete);

routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
