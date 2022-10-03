import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChainEventLog } from '../entity/ChainEventLog';
import { Subscriptions } from '../entity/Subscriptions';
import { ChainEventLogsRepositoryImple } from './ChainEventLogsRepositoryImple';
import { SubscriptionRepositoryImpl } from './SubscriptionRepositoryImpl';

@Module({
  imports: [TypeOrmModule.forFeature([ChainEventLog, Subscriptions])],
  providers: [ChainEventLogsRepositoryImple, SubscriptionRepositoryImpl],
  exports: [ChainEventLogsRepositoryImple, SubscriptionRepositoryImpl],
})
export class InfraModule {}
