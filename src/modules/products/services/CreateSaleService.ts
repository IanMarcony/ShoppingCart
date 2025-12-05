import { inject, injectable } from 'tsyringe';
import Sales from '../infra/typeorm/entities/Sales';
import IProductsRepository from '../repositories/IProductsRepository';
import ISalesRepository from '../repositories/ISalesRepository';
import AppError from '@shared/errors/AppError';
import ISaleItemDTO from '../dtos/ISaleItemDTO';

interface IItemSale {
  sku_product: string;
}

interface IRequest {
  items: IItemSale[];
}

@injectable()
export default class CreateSaleService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('SalesRepository')
    private salesRepository: ISalesRepository,
  ) {}

  public async execute({ items }: IRequest): Promise<Sales> {
    if (!items || items.length === 0) {
      throw new AppError('Cart is empty. Please add items to proceed.');
    }

    const uniqueSKUs = Array.from(new Set(items.map(item => item.sku_product)));
    const products = await this.productsRepository.findBySKUs(uniqueSKUs);

    const productMap = new Map(products.map(p => [p.sku, p]));

    // Validar se todos os produtos existem
    uniqueSKUs.forEach(sku => {
      if (!productMap.has(sku)) {
        throw new AppError(`Product with SKU "${sku}" not found.`);
      }
    });

    const productCounts = new Map<number, number>();

    const productIdMap = new Map<number, typeof products[0]>();

    items.forEach(item => {
      const product = productMap.get(item.sku_product)!;
      productIdMap.set(product.id, product);
      productCounts.set(
        product.id,
        (productCounts.get(product.id) || 0) + 1,
      );
    });

    // Apply promos and calculate totals
    const saleItems: ISaleItemDTO[] = [];
    let total = 0;

    productCounts.forEach((quantity, productId) => {
      const product = productIdMap.get(productId)!;
      const unitPrice = Number(product.price);
      let finalQuantity = quantity;
      let subtotal = 0;

      // Promotion: Buy 3 Google Homes for the price of 2
      if (product.name === 'Google Home') {
        const freeItems = Math.floor(quantity / 3);
        const payableItems = quantity - freeItems;
        subtotal = payableItems * unitPrice;
      }
      // Promotion: Buying more than 3 Alexa Speakers will have a 10% discount
      else if (product.name === 'Alexa Speaker' && quantity > 3) {
        const discountedPrice = unitPrice * 0.9;
        subtotal = quantity * discountedPrice;
      }
      // Promotion: Each sale of a MacBook Pro comes with a free Raspberry Pi
      else if (product.name === 'MacBook Pro') {
        subtotal = quantity * unitPrice;
        // Add Raspberry Pi free
        const raspberryPi = Array.from(productIdMap.values()).find(
          p => p.name === 'Raspberry Pi B',
        );
        if (raspberryPi) {
          // Check if it has not already been added
          const existingRaspberry = saleItems.find(
            item => item.product_id === raspberryPi.id,
          );
          if (!existingRaspberry) {
            saleItems.push({
              product_id: raspberryPi.id,
              quantity: quantity,
              unit_price: 0,
              subtotal: 0,
            });
          }
        }
      }
      // Normal price
      else {
        subtotal = quantity * unitPrice;
      }

      saleItems.push({
        product_id: productId,
        quantity: finalQuantity,
        unit_price: unitPrice,
        subtotal: Number(subtotal.toFixed(2)),
      });

      total += subtotal;
    });

    const sale = await this.salesRepository.create({
      items: saleItems,
      total: Number(total.toFixed(2)),
    });

    return sale;
  }
}