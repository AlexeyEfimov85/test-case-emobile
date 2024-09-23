import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Balance {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ default: 0 })
    shelve!: number;

    @Column({ default: 0 })
    stock!: number;

    @Column()
    shop_id!: number;

    @Column()
    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => Product, (product) => product.balance)
    product!: Product;

}