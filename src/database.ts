import { DataSource } from 'typeorm';
import { Subscriptions } from './subscriptions/entity/Subscriptions';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './data/ether.sqlite',
  logging: true,
  entities: [Subscriptions],
});
