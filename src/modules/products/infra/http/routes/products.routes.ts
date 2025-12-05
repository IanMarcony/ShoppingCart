import { Router } from 'express';

import ProductsController from '../controllers/ProductsController';

const productsRouter = Router();

const productsController = new ProductsController();

productsRouter.get('/', productsController.index);
productsRouter.get('/:sku', productsController.show);

export default productsRouter;