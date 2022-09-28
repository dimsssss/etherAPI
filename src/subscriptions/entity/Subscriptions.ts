import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Subscriptions {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  topics: string;

  @Column()
  contractAddress: string;

  @Column({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
