import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Balance } from './balance.entity';
import { ChangesHistory } from './changesHistory.entity';

@Entity()
export class Product {
    @Column()
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    plu!: string;

    @Column()
    product_name!: string;

    @Column({ default: 0 })
    quantity_at_shelve!: number;

    @Column({ default: 0 })
    quantity_in_stock!: number;

    @Column()
    shop_id!: number;

    @Column()
    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Balance, (balance) => balance.product)
    balance!: Balance[];

    @OneToMany(() => ChangesHistory, (changesHistory) => changesHistory.product)
    changesHistory!: ChangesHistory[];

}
