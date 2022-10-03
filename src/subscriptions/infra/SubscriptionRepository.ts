import { Subscriptions } from '../entity/Subscriptions';
import { CreateSubscriptions } from '../dto/CreateSubscriptions';
import { ChainEventLog } from '../entity/ChainEventLog';

export interface SubscriptionRepository {
  save(subscription: CreateSubscriptions): Promise<Subscriptions>;
  find(): Promise<Subscriptions[]>;
  findOne(subscriptionId?: number): Promise<Subscriptions>;
  findDeleted(subscriptionId: number, withDeleted: boolean): Promise<Subscriptions>;
  findBy(subscriptionId: number, offset: number, limit: number): Promise<ChainEventLog[]>;
  findOneBy(subscriptionId: number): Promise<Subscriptions>;
  softDelete(subscriptionId: number): Promise<void>;
}
