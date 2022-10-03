import { Transform } from 'class-transformer';

export class EventLog {
  id: number;
  timestamp: Date;
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;
  removed: boolean;
  address: string;
  data: string;
  @Transform(({ value }) => [].concat(value.split(',')))
  topics: string[];
  transactionHash: string;
  logIndex: number;
}
