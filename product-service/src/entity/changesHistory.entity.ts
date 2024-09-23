import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ChangesHistory {
  @Column()
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  historyActionName!: string;

  @Column()
  plu!: string;

  @Column()
  shop_id!: number;

  @Column()
  createdAt!: Date;

  @ManyToMany(() => Product, (product) => product.changesHistory)
  product!: Product;

}