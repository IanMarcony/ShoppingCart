import IShopperCartDTO from "../dtos/IShopperCartDTO";
import Sales from "../infra/typeorm/entities/Sales";

export default interface ISalesRepository {
    create(data: IShopperCartDTO): Promise<Sales>;
    findAll(): Promise<Sales[]>;
}