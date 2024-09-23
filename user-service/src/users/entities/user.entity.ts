import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: 0 })
  age: number;

  @Column({ default: 'M' })
  gender: string;

  @Column({ default: true })
  isProblem: boolean;
}
