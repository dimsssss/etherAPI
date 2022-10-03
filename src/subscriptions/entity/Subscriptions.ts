import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ChainEventLog } from './ChainEventLog';

@Entity()
export class Subscriptions {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  topics: string;

  @Column()
  contractAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany((type) => ChainEventLog, (c) => c.address)
  logs: ChainEventLog[];
}
