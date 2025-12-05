import { Router } from 'express';

import productsRouter from '@modules/products/infra/http/routes/products.routes';
import shoppersRouter from '@modules/products/infra/http/routes/shoppers.routes';

const routes = Router();

routes.use('/products', productsRouter);
routes.use('/shoppers', shoppersRouter);

export default routes;