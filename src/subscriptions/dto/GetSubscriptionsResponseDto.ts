import { CreateSubscriptionsResponse } from '../dto/CreateSubscriptionsResponse';
import { SummaryLog } from './SummaryLog';

export class GetSubscriptionsResponseDto {
  subscription: CreateSubscriptionsResponse;
  summayLog: SummaryLog;
}
