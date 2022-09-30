import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
