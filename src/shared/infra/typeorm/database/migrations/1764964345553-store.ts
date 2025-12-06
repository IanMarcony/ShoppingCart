import { MigrationInterface, QueryRunner } from 'typeorm';

export class Store1764964345553 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create sample products
    await queryRunner.query(`
      INSERT INTO products (sku, name, price) VALUES
      ('120P90', 'Google Home', 49.99),
      ('43N23P', 'MacBook Pro', 5399.99),
      ('A304SD', 'Alexa Speaker', 109.50),
      ('344222', 'Raspberry Pi B', 30.00)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove sample products
    await queryRunner.query(`
      DELETE FROM products WHERE sku IN ('120P90', '43N23P', 'A304SD', '344222')
    `);
  }
}
