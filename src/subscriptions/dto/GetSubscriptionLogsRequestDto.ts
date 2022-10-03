import { IsIn } from 'class-validator';

export class GetSubscriptionLogsRequestDto {
  offset: number;
  limit: number;
  @IsIn(['asc', 'desc'])
  sort: string;
  start: number | null;
  end: number | null;
}
