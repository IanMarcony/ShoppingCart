import IShopperCartDTO from "@modules/products/dtos/IShopperCartDTO";
import ISalesRepository from "@modules/products/repositories/ISalesRepository";
import Sales from "../entities/Sales";
import { AppDataSource } from "data-source";
import { Repository } from "typeorm";

export default class SalesRepository implements ISalesRepository {
    private ormRepository: Repository<Sales>;
    
    constructor() {
        this.ormRepository = AppDataSource.getRepository(Sales);
    }

    public async create(data: IShopperCartDTO): Promise<Sales> {
        const sale = this.ormRepository.create(data);

        return await this.ormRepository.save(sale);
    }
    
    public async findAll(): Promise<Sales[]> {
        const sales = await this.ormRepository.find({
            relations: ['items'],
        });

        return sales;
    }


    
}