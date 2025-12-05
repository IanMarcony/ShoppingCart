import IProductsRepository from "@modules/products/repositories/IProductsRepository";
import Product from "../entities/Product";
import { Repository } from "typeorm";
import { AppDataSource } from "data-source";

export default class ProductsRepository implements IProductsRepository{
    private ormRepository: Repository<Product>;

    constructor() {
        this.ormRepository = AppDataSource.getRepository(Product);
    }

    public async findBySKU(sku_product: string): Promise<Product | null> {
       const product = await this.ormRepository.findOne({ where: { sku: sku_product } });

       return product;
    }

    public async findBySKUs(skus: string[]): Promise<Product[]> {
        const products = await this.ormRepository
            .createQueryBuilder('product')
            .where('product.sku IN (:...skus)', { skus })
            .getMany();

        return products;
    }

    public async findAll(): Promise<Product[]> {
        const products = await this.ormRepository.find();

        return products;
    }
    
}