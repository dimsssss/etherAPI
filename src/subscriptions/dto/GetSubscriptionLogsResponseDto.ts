import { ChainEventLog } from '../entity/ChainEventLog';

export class GetSubscriptionLogsResponseDto {
  id: number;
  logSize: number;
  logSizeInCondition: number;
  offset: number;
  limit: number;
  sort: 'asc' | 'desc';
  start: number | null;
  end: number | null;
  logs: ChainEventLog[];
}
