import { Module } from '@nestjs/common';
import { SubcriptionModule } from './subscriptions/SubcriptionModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriptions } from './subscriptions/entity/Subscriptions';
import { ChainEventLog } from './subscriptions/entity/ChainEventLog';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './data/ether.sqlite',
      entities: [Subscriptions, ChainEventLog],
    }),
    SubcriptionModule,
  ],
})
export class AppModule {}
