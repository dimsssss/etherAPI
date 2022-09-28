import { IsString } from 'class-validator';

export class CreateSubscriptions {
  @IsString({ each: true })
  topics: string;
  @IsString()
  contractAddress: string;
}
