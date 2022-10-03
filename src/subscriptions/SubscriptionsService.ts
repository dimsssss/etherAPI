import { Injectable } from '@nestjs/common';
import { Subscriptions } from './entity/Subscriptions';
import { CreateSubscriptionsResponse } from './dto/CreateSubscriptionsResponse';
import { CreateSubscriptions } from './dto/CreateSubscriptions';
import { ethers } from 'ethers';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ChainEventLog } from './entity/ChainEventLog';
import { SummaryLog } from './dto/SummaryLog';
import { GetSubscriptionsResponseDto } from './dto/GetSubscriptionsResponseDto';
import { ABI } from './enums/ABI';
import { NotFoundSubcription } from './exceptions/NotFoundSubcription';
import { GetSubscriptionLogsRequestDto } from './dto/GetSubscriptionLogsRequestDto';
import { ChainEventLogsRepositoryImple } from './infra/ChainEventLogsRepositoryImple';
import { Page } from './utils/Page';
import { SubscriptionRepositoryImpl } from './infra/SubscriptionRepositoryImpl';
import { GetSubscriptionLogsResponseDto } from './dto/GetSubscriptionLogsResponseDto';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepositoryImpl,
    private readonly chainEventLogsRepository: ChainEventLogsRepositoryImple,
    private page: Page,
  ) {}
  async registerSubscriptions(subcriptions: CreateSubscriptions): Promise<CreateSubscriptionsResponse> {
    const result = await this.subscriptionRepository.save(subcriptions);
    const infura = await new ethers.providers.InfuraProvider(process.env.NETWORK, process.env.API_KEY);
    const daiContract = new ethers.Contract(subcriptions.contractAddress, Object.values(ABI), infura);

    daiContract.on('Transfer', (from, to, amount, event) => {
      this.chainEventLogsRepository.save(plainToClass(ChainEventLog, event, { excludeExtraneousValues: true }));
    });
    daiContract.on('Approval', (from, to, amount, event) => {
      this.chainEventLogsRepository.save(plainToClass(ChainEventLog, event, { excludeExtraneousValues: true }));
    });
    daiContract.on('ApprovalForAll', (from, to, isApproval, event) => {
      this.chainEventLogsRepository.save(plainToClass(ChainEventLog, event, { excludeExtraneousValues: true }));
    });
    daiContract.on('PunkOffered', (value1, value2, address, event) => {
      this.chainEventLogsRepository.save(plainToClass(ChainEventLog, event, { excludeExtraneousValues: true }));
    });
    daiContract.on('PunkTransfer', (from, to, amount, event) => {
      this.chainEventLogsRepository.save(plainToClass(ChainEventLog, event, { excludeExtraneousValues: true }));
    });
    return plainToClass(CreateSubscriptionsResponse, result, { excludeExtraneousValues: true });
  }

  async getSubscriptionList(): Promise<CreateSubscriptionsResponse[]> {
    const subcriptions: Subscriptions[] = await this.subscriptionRepository.find();
    return plainToInstance(CreateSubscriptionsResponse, subcriptions);
  }

  async getSubscription(subscriptionId: number): Promise<GetSubscriptionsResponseDto> {
    const subscription: Subscriptions = await this.subscriptionRepository.findOne(subscriptionId);

    if (!subscription) {
      throw new NotFoundSubcription(subscriptionId);
    }

    const [log, logSize]: [log: ChainEventLog[], logSize: number] = await this.chainEventLogsRepository.findAndCountBy(
      subscription,
    );

    const summary: SummaryLog = plainToClass(SummaryLog, {
      logSize,
      firstLogTimestamp: log[0] === undefined ? null : log[0].createdAt,
    });

    const subscriptions: GetSubscriptionsResponseDto = plainToClass(GetSubscriptionsResponseDto, {
      ...plainToClass(CreateSubscriptionsResponse, subscription),
      ...summary,
    });
    return subscriptions;
  }

  async deleteSubscription(subscriptionId: number): Promise<CreateSubscriptionsResponse> {
    const subscription: Subscriptions = await this.subscriptionRepository.findOneBy(subscriptionId);

    if (!subscription) {
      throw new NotFoundSubcription(subscriptionId);
    }

    const events: string[] = Object.values(ABI);
    const infura = await new ethers.providers.InfuraProvider(process.env.NETWORK, process.env.API_KEY);
    const daiContract = new ethers.Contract(subscription.contractAddress, events, infura);

    daiContract.removeAllListeners();
    await this.subscriptionRepository.softDelete(subscriptionId);
    const result: Subscriptions = await this.subscriptionRepository.findDeleted(subscriptionId, true);
    return plainToClass(CreateSubscriptionsResponse, result);
  }

  async getSubscriptionLogs(
    subscriptionId: number,
    condition: GetSubscriptionLogsRequestDto,
  ): Promise<GetSubscriptionLogsResponseDto> {
    const subscription: Subscriptions = await this.subscriptionRepository.findOne(subscriptionId);

    if (!subscription) {
      throw new NotFoundSubcription(subscriptionId);
    }

    const logSize: number = await this.chainEventLogsRepository.countLog(subscription.contractAddress);
    const logSizeInCondition: number = await this.chainEventLogsRepository.countLogBy(
      subscription.contractAddress,
      condition.start,
      condition.end,
    );
    const offset: number = this.page.getOffset(logSizeInCondition, condition.limit, condition.offset);

    // 현재 페이지 데이터 조회
    const result = await this.subscriptionRepository.findBy(subscriptionId, offset, condition.limit);
    return plainToClass(GetSubscriptionLogsResponseDto, {
      id: subscriptionId,
      logSize,
      logSizeInCondition,
      sort: condition.sort,
      start: condition.start,
      end: condition.end,
      offset: condition.offset,
      limit: condition.limit,
      logs: result,
    });
  }
}
