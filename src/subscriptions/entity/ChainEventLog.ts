import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ChainEventLog')
export class ChainEventLog {
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
}
