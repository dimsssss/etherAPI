import { Transform, Expose } from 'class-transformer';

export class CreateSubscriptionsResponse {
  @Expose()
  id: number;
  @Expose()
  @Transform(({ value }) => [].concat(value.split(',')))
  topics: string[];
  @Expose()
  contractAddress: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;

  deletedAt: Date;
}
