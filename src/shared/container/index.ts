import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import SalesRepository from '@modules/products/infra/typeorm/repositories/SalesRepository';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ISalesRepository from '@modules/products/repositories/ISalesRepository';
import {container} from 'tsyringe';


container.registerSingleton<IProductsRepository>(
    "ProductsRepository",
    ProductsRepository
);

container.registerSingleton<ISalesRepository>(
    "SalesRepository",
    SalesRepository
);