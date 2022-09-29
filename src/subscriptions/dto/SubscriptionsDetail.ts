import { Subscriptions } from '../entity/Subscriptions';
import { SummaryLog } from './SummaryLog';

export class SubscriptionsDetail extends Subscriptions {
  summary: SummaryLog;
}
