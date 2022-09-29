import { Type } from 'class-transformer';
import { CreateSubscriptionsResponse } from '../dto/CreateSubscriptionsResponse';

export class SubscriptionsList {
  @Type(() => CreateSubscriptionsResponse)
  subscriptions: CreateSubscriptionsResponse[];
}
