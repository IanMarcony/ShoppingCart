import { Router } from 'express';

import ShoppersController from '../controllers/ShoppersController';

const ShoppersRouter = Router();

const shoppersController = new ShoppersController();

ShoppersRouter.post('/', shoppersController.create);
ShoppersRouter.get('/', shoppersController.index);

export default ShoppersRouter;