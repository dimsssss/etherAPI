import { Module } from '@nestjs/common';
import { SubcriptionController } from './SubcriptionController';
import { SubscriptionsService } from './SubscriptionsService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriptions } from './entity/Subscriptions';
import { ChainEventLog } from './entity/ChainEventLog';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriptions, ChainEventLog])],
  controllers: [SubcriptionController],
  providers: [SubscriptionsService],
})
export class SubcriptionModule {}
