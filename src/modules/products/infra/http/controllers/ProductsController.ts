import { Request, Response } from 'express';

import ProductsRepository from '../../typeorm/repositories/ProductsRepository';



export default class ProductsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const repository = new ProductsRepository();
    
    const products = await repository.findAll();

    return res.status(200).json(products);
  }

  public async show(req: Request, res: Response): Promise<Response> {
    let sku = req.params.sku as unknown as string;

    const repository = new ProductsRepository();

    const product = await repository.findBySKU(sku);

    return res.status(200).json(product);
  }
}