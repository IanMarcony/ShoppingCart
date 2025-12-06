import { Request, Response } from 'express';

import ProductsRepository from '../../typeorm/repositories/ProductsRepository';



export default class ProductsController {
  public async index(req: Request, res: Response): Promise<Response> {
    console.log("Get All Products");

    const repository = new ProductsRepository();
    
    const products = await repository.findAll();

    console.log("Products retrieved:", products.length);

    return res.status(200).json(products);
  }

  public async show(req: Request, res: Response): Promise<Response> {
    let sku = req.params.sku as unknown as string;

    console.log("Get Product with SKU:", sku);

    const repository = new ProductsRepository();

    const product = await repository.findBySKU(sku);

    console.log("Product retrieved:", product);

    return res.status(200).json(product);
  }
}