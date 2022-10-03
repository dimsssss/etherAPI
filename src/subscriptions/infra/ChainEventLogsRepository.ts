import { ChainEventLog } from '../entity/ChainEventLog';
import { Subscriptions } from '../entity/Subscriptions';

export interface ChainEventLogsRepository {
  save(chanEventLog: ChainEventLog): Promise<void>;
  countLog(address: string): Promise<number>;
  countLogBy(address: string, start?: number, end?: number): Promise<number>;
  findAndCountBy(subscription: Subscriptions): Promise<[log: ChainEventLog[], logSize: number]>;
}
