import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';
import { Subscriptions } from './Subscriptions';

@Entity('ChainEventLog')
export class ChainEventLog {
  @BeforeInsert()
  adressToLower() {
    this.address = this.address.toLowerCase();
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  blockNumber: number;

  @Column()
  blockHash: string;

  @Column()
  transactionIndex: number;

  @Column()
  removed: boolean;

  @Column()
  address: string;

  @Column()
  data: string;

  @Column()
  topics: string;

  @Column()
  transactionHash: string;

  @Column()
  logIndex: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => Subscriptions, (s) => s.contractAddress)
  subscription: Subscriptions;
}
