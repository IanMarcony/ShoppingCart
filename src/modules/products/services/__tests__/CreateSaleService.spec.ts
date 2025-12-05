import CreateSaleService from '../CreateSaleService';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ISalesRepository from '@modules/products/repositories/ISalesRepository';
import AppError from '@shared/errors/AppError';
import Product from '@modules/products/infra/typeorm/entities/Product';
import Sales from '@modules/products/infra/typeorm/entities/Sales';

let productsRepository: jest.Mocked<IProductsRepository>;
let salesRepository: jest.Mocked<ISalesRepository>;
let createSaleService: CreateSaleService;

describe('CreateSaleService', () => {
  beforeEach(() => {
    productsRepository = {
      findBySKU: jest.fn(),
      findBySKUs: jest.fn(),
      findAll: jest.fn(),
    };

    salesRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
    };

    createSaleService = new CreateSaleService(
      productsRepository,
      salesRepository,
    );
  });

  describe('Error Cases', () => {
    it('should throw error when cart is empty', async () => {
      await expect(
        createSaleService.execute({ items: [] }),
      ).rejects.toBeInstanceOf(AppError);

      await expect(
        createSaleService.execute({ items: [] }),
      ).rejects.toHaveProperty(
        'message',
        'Cart is empty. Please add items to proceed.',
      );
    });

    it('should throw error when product is not found', async () => {
      productsRepository.findBySKUs.mockResolvedValue([]);

      await expect(
        createSaleService.execute({
          items: [{ sku_product: 'INVALID_SKU' }],
        }),
      ).rejects.toBeInstanceOf(AppError);

      await expect(
        createSaleService.execute({
          items: [{ sku_product: 'INVALID_SKU' }],
        }),
      ).rejects.toHaveProperty(
        'message',
        'Product with SKU "INVALID_SKU" not found.',
      );
    });
  });

  describe('Success Cases - Normal Prices', () => {
    it('should create sale with single product at normal price', async () => {
      const mockProduct: Product = {
        id: 1,
        sku: 'TEST123',
        name: 'Test Product',
        price: 100,
        saleItems: [],
        created_at: new Date(),
      };

      const mockSale: Sales = {
        id: 'uuid-123',
        total: 100,
        items: [],
        created_at: new Date(),
        updated_at: new Date(),
      };

      productsRepository.findBySKUs.mockResolvedValue([mockProduct]);
      salesRepository.create.mockResolvedValue(mockSale);

      const result = await createSaleService.execute({
        items: [{ sku_product: 'TEST123' }],
      });

      expect(result).toBeDefined();
      expect(salesRepository.create).toHaveBeenCalledWith({
        items: [
          {
            product_id: 1,
            quantity: 1,
            unit_price: 100,
            subtotal: 100,
          },
        ],
        total: 100,
      });
    });

    it('should create sale with multiple quantities of same product', async () => {
      const mockProduct: Product = {
        id: 1,
        sku: 'TEST123',
        name: 'Test Product',
        price: 50,
        saleItems: [],
        created_at: new Date(),
      };

      productsRepository.findBySKUs.mockResolvedValue([mockProduct]);
      salesRepository.create.mockResolvedValue({} as Sales);

      await createSaleService.execute({
        items: [
          { sku_product: 'TEST123' },
          { sku_product: 'TEST123' },
          { sku_product: 'TEST123' },
        ],
      });

      expect(salesRepository.create).toHaveBeenCalledWith({
        items: [
          {
            product_id: 1,
            quantity: 3,
            unit_price: 50,
            subtotal: 150,
          },
        ],
        total: 150,
      });
    });
  });

  describe('Success Cases - Promotions', () => {
    it('should apply Google Home promotion: Buy 3 for the price of 2', async () => {
      const googleHome: Product = {
        id: 1,
        sku: '120P90',
        name: 'Google Home',
        price: 49.99,
        saleItems: [],
        created_at: new Date(),
      };

      productsRepository.findBySKUs.mockResolvedValue([googleHome]);
      salesRepository.create.mockResolvedValue({} as Sales);

      await createSaleService.execute({
        items: [
          { sku_product: '120P90' },
          { sku_product: '120P90' },
          { sku_product: '120P90' },
        ],
      });

      expect(salesRepository.create).toHaveBeenCalledWith({
        items: [
          {
            product_id: 1,
            quantity: 3,
            unit_price: 49.99,
            subtotal: 99.98,
          },
        ],
        total: 99.98,
      });
    });

    it('should apply Alexa Speaker promotion: 10% discount when buying more than 3', async () => {
      const alexaSpeaker: Product = {
        id: 1,
        sku: 'A304SD',
        name: 'Alexa Speaker',
        price: 109.5,
        saleItems: [],
        created_at: new Date(),
      };

      productsRepository.findBySKUs.mockResolvedValue([alexaSpeaker]);
      salesRepository.create.mockResolvedValue({} as Sales);

      await createSaleService.execute({
        items: [
          { sku_product: 'A304SD' },
          { sku_product: 'A304SD' },
          { sku_product: 'A304SD' },
          { sku_product: 'A304SD' },
        ],
      });

      const discountedPrice = 109.5 * 0.9;
      const expectedTotal = discountedPrice * 4;

      expect(salesRepository.create).toHaveBeenCalledWith({
        items: [
          {
            product_id: 1,
            quantity: 4,
            unit_price: 109.5,
            subtotal: Number(expectedTotal.toFixed(2)),
          },
        ],
        total: Number(expectedTotal.toFixed(2)),
      });
    });

    it('should NOT apply Alexa discount when buying 3 or less', async () => {
      const alexaSpeaker: Product = {
        id: 1,
        sku: 'A304SD',
        name: 'Alexa Speaker',
        price: 109.5,
        saleItems: [],
        created_at: new Date(),
      };

      productsRepository.findBySKUs.mockResolvedValue([alexaSpeaker]);
      salesRepository.create.mockResolvedValue({} as Sales);

      await createSaleService.execute({
        items: [
          { sku_product: 'A304SD' },
          { sku_product: 'A304SD' },
          { sku_product: 'A304SD' },
        ],
      });

      expect(salesRepository.create).toHaveBeenCalledWith({
        items: [
          {
            product_id: 1,
            quantity: 3,
            unit_price: 109.5,
            subtotal: 328.5,
          },
        ],
        total: 328.5,
      });
    });

    it('should add free Raspberry Pi when buying MacBook Pro', async () => {
      const macbook: Product = {
        id: 1,
        sku: '43N23P',
        name: 'MacBook Pro',
        price: 5399.99,
        saleItems: [],
        created_at: new Date(),
      };

      const raspberry: Product = {
        id: 2,
        sku: '344222',
        name: 'Raspberry Pi B',
        price: 30,
        saleItems: [],
        created_at: new Date(),
      };

      productsRepository.findBySKUs.mockResolvedValue([macbook, raspberry]);
      salesRepository.create.mockResolvedValue({} as Sales);

      await createSaleService.execute({
        items: [{ sku_product: '43N23P' }, { sku_product: '344222' }],
      });

      expect(salesRepository.create).toHaveBeenCalledWith({
        items: expect.arrayContaining([
          {
            product_id: 1,
            quantity: 1,
            unit_price: 5399.99,
            subtotal: 5399.99,
          },
          {
            product_id: 2,
            quantity: 1,
            unit_price: 0,
            subtotal: 0,
          },
          {
            product_id: 2,
            quantity: 1,
            unit_price: 30,
            subtotal: 30,
          },
        ]),
        total: 5429.99,
      });
    });
  });

  describe('Success Cases - Combined Scenarios', () => {
    it('should handle multiple different products correctly', async () => {
      const googleHome: Product = {
        id: 1,
        sku: '120P90',
        name: 'Google Home',
        price: 49.99,
        saleItems: [],
        created_at: new Date(),
      };

      const alexaSpeaker: Product = {
        id: 2,
        sku: 'A304SD',
        name: 'Alexa Speaker',
        price: 109.5,
        saleItems: [],
        created_at: new Date(),
      };

      productsRepository.findBySKUs.mockResolvedValue([
        googleHome,
        alexaSpeaker,
      ]);
      salesRepository.create.mockResolvedValue({} as Sales);

      await createSaleService.execute({
        items: [
          { sku_product: '120P90' },
          { sku_product: '120P90' },
          { sku_product: 'A304SD' },
        ],
      });

      const googleHomeTotal = 2 * 49.99; // 2 items, no promotion (needs 3)
      const alexaTotal = 109.5; // 1 item, no discount
      const expectedTotal = googleHomeTotal + alexaTotal;

      expect(salesRepository.create).toHaveBeenCalledWith({
        items: expect.arrayContaining([
          {
            product_id: 1,
            quantity: 2,
            unit_price: 49.99,
            subtotal: Number(googleHomeTotal.toFixed(2)),
          },
          {
            product_id: 2,
            quantity: 1,
            unit_price: 109.5,
            subtotal: 109.5,
          },
        ]),
        total: Number(expectedTotal.toFixed(2)),
      });
    });
  });
});
