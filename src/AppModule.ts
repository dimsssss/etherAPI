import { Module } from '@nestjs/common';
import { SubcriptionModule } from './subscriptions/SubcriptionModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriptions } from './subscriptions/entity/Subscriptions';
import { ChainEventLog } from './subscriptions/entity/ChainEventLog';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './data/ether.sqlite',
      entities: [Subscriptions, ChainEventLog],
    }),
    ConfigModule.forRoot(),
    SubcriptionModule,
  ],
})
export class AppModule {}
