import { Transform } from 'class-transformer';

export class CreateSubscriptionsResponse {
  id: number;
  @Transform(({ value }) => [].concat(value.split(',')))
  topics: string[];
  contractAddress: string;
  createdAt: Date;
  updatedAt: Date;
}
