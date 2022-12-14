import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  BadRequestException,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { CreateSubscriptions } from './dto/CreateSubscriptions';
import { SubscriptionsService } from './SubscriptionsService';
import { CreateSubscriptionsResponse } from './dto/CreateSubscriptionsResponse';
import { ValidationPipe } from './pipe/ValidationPipe';
import { GetSubsctiprionLogsRequestValidation } from './pipe/GetSubsctiprionLogsRequestValidation';
import { SubscriptionsList } from './dto/SubscriptionsList';
import { GetSubscriptionsResponseDto } from './dto/GetSubscriptionsResponseDto';
import { NotFoundSubcription } from './exceptions/NotFoundSubcription';
import { GetSubscriptionLogsRequestDto } from './dto/GetSubscriptionLogsRequestDto';
import { NotFoundChainEventLogException } from './exceptions/NotFoundChainEventLogException';
import { GetSubscriptionLogsResponseDto } from './dto/GetSubscriptionLogsResponseDto';

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

  /**
   *
   * @param subscriptionId API 명세에는 subscription-id로 고정되어있지만
   * param으로 뽑기가 어려워 편의를 위해 subscriptionId로 변경하였습니다
   * @returns
   */
  @Get('/:subscriptionId')
  async getSubscription(@Param('subscriptionId') subscriptionId: number): Promise<GetSubscriptionsResponseDto> {
    try {
      return await this.subscriptionsService.getSubscription(subscriptionId);
    } catch (err) {
      if (err instanceof NotFoundChainEventLogException) {
        throw new BadRequestException(err);
      }
    }
  }

  @Get('/:subscriptionId/logs')
  async getSubscriptionLogEnvent(
    @Param('subscriptionId') subscriptionId: number,
    @Query(new GetSubsctiprionLogsRequestValidation()) pageCondition: GetSubscriptionLogsRequestDto,
  ): Promise<GetSubscriptionLogsResponseDto> {
    try {
      return await this.subscriptionsService.getSubscriptionLogs(subscriptionId, pageCondition);
    } catch (err) {
      if (err instanceof NotFoundSubcription) {
        throw new BadRequestException(err);
      }
      throw new InternalServerErrorException(err);
    }
  }

  @Delete('/:subscriptionId')
  async deleteSubscription(@Param('subscriptionId') subscriptionId: number): Promise<CreateSubscriptionsResponse> {
    try {
      return await this.subscriptionsService.deleteSubscription(subscriptionId);
    } catch (err) {
      if (err instanceof NotFoundSubcription) {
        throw new BadRequestException(err);
      }
      throw new InternalServerErrorException(err);
    }
  }
}
