import Product from "../infra/typeorm/entities/Product";

export default interface IProductsRepository {
    findBySKU(sku_product: string): Promise<Product | null>;
    findBySKUs(skus: string[]): Promise<Product[]>;
    findAll(): Promise<Product[]>;
}