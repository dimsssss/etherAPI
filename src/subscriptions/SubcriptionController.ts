import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateSubscriptions } from './dto/CreateSubscriptions';
import { SubscriptionsService } from './SubscriptionsService';
import { CreateSubscriptionsResponse } from './dto/CreateSubscriptionsResponse';
import { ValidationPipe } from './pipe/ValidationPipe';
import { SubscriptionsList } from './dto/SubscriptionsList';

@Controller('/subscriptions')
export class SubcriptionController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  async registerSubscription(
    @Body(new ValidationPipe()) createSubscriptions: CreateSubscriptions,
  ): Promise<CreateSubscriptionsResponse> {
    return await this.subscriptionsService.registerSubscriptions(createSubscriptions);
  }
  @Get()
  async getSubscriptionList(): Promise<SubscriptionsList> {
    const subscriptions: CreateSubscriptionsResponse[] = await this.subscriptionsService.getSubscriptionList();
    return { subscriptions };
  }
}
