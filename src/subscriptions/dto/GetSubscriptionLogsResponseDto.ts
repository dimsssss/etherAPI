import { EventLog } from './EventLog';
import { Type } from 'class-transformer';

export class GetSubscriptionLogsResponseDto {
  id: number;
  logSize: number;
  logSizeInCondition: number;
  offset: number;
  limit: number;
  sort: 'asc' | 'desc';
  start: number | null;
  end: number | null;
  @Type(() => EventLog)
  logs: EventLog[];
}
