import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Product from './Product';
import Sale from './Sales';

@Entity({ name: 'sale_items' })
export default class SaleItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Sale, sale => sale.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sale_id' })
    sale: Sale;

    @Column()
    sale_id: string;

    @ManyToOne(() => Product, product => product.saleItems)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    product_id: number;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unit_price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number;
}
