import { Module } from '@nestjs/common';
import { SubcriptionController } from './SubcriptionController';
import { SubscriptionsService } from './SubscriptionsService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriptions } from './entity/Subscriptions';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriptions])],
  controllers: [SubcriptionController],
  providers: [SubscriptionsService],
})
export class SubcriptionModule {}
