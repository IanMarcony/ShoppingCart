import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import SaleItem from './SaleItem';

@Entity({ name: 'sales' })
export default class Sales {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @OneToMany(() => SaleItem, saleItem => saleItem.sale, { cascade: true })
    items: SaleItem[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}