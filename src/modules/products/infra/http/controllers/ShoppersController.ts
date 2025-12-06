import { Request, Response } from 'express';
import {container} from 'tsyringe';
import SalesRepository from '../../typeorm/repositories/SalesRepository';
import CreateSaleService from '@modules/products/services/CreateSaleService';

export default class ShoppersController {
  public async index(req: Request, res: Response): Promise<Response> {
    console.log("Get All Sales");
    const repository = new SalesRepository();
       
    const sales = await repository.findAll();

    console.log("Sales retrieved:", sales.length);
    return res.status(200).json(sales);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { items } = req.body;

    console.log("Creating a new sale with items:", items);

    const createSaleService = container.resolve(CreateSaleService);

    const sale = await createSaleService.execute({
        items,
    });

    console.log("Sale created with ID:", sale.id);

    return res.status(200).json(sale);
  }
}