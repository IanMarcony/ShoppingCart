import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import SaleItem from './SaleItem';

@Entity({ name: 'products' })
export default class Product{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', unique: true})
    sku: string;

    @Column({type: 'varchar'})
    name: string;

    @Column({type: 'decimal', precision: 10, scale: 2})
    price: number;

    @OneToMany(() => SaleItem, saleItem => saleItem.product)
    saleItems: SaleItem[];

    @CreateDateColumn()
    created_at: Date;
}