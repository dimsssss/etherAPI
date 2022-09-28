import { Module } from '@nestjs/common';
import { SubcriptionModule } from './subscriptions/SubcriptionModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriptions } from './subscriptions/entity/Subscriptions';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './data/ether.sqlite',
      entities: [Subscriptions],
    }),
    SubcriptionModule,
  ],
})
export class AppModule {}
