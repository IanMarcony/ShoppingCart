import { Request, Response } from 'express';
import {container} from 'tsyringe';
import SalesRepository from '../../typeorm/repositories/SalesRepository';
import CreateSaleService from '@modules/products/services/CreateSaleService';

export default class ShoppersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const repository = new SalesRepository();
       
    const sales = await repository.findAll();

    return res.status(200).json(sales);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { items } = req.body;

    const createSaleService = container.resolve(CreateSaleService);

    const sale = await createSaleService.execute({
        items,
    });

    return res.status(200).json(sale);
  }
}