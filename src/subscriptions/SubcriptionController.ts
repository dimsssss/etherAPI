import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateSubscriptions } from './dto/CreateSubscriptions';
import { SubscriptionsService } from './SubscriptionsService';
import { CreateSubscriptionsResponse } from './dto/CreateSubscriptionsResponse';
import { ValidationPipe } from './pipe/ValidationPipe';

@Controller('/subscriptions')
export class SubcriptionController {
  constructor(private readonly appService: SubscriptionsService) {}

  @Post()
  async registerSubscription(
    @Body(new ValidationPipe()) createSubscriptions: CreateSubscriptions,
  ): Promise<CreateSubscriptionsResponse> {
    return await this.appService.registerSubscriptions(createSubscriptions);
  }
}
