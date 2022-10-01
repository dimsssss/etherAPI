import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
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

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscriptions)
    private subscriptionsRepository: Repository<Subscriptions>,
    @InjectRepository(ChainEventLog)
    private chainEventLogRepository: Repository<ChainEventLog>,
  ) {}
  async registerSubscriptions(subcriptions: CreateSubscriptions): Promise<CreateSubscriptionsResponse> {
    const result = await this.subscriptionsRepository.save(subcriptions);
    const infura = await new ethers.providers.InfuraProvider(process.env.NETWORK, process.env.API_KEY);
    const daiContract = new ethers.Contract(subcriptions.contractAddress, Object.values(ABI), infura);

    daiContract.on('Transfer', (from, to, amount, event) => {
      this.chainEventLogRepository.save(plainToClass(ChainEventLog, event, { excludeExtraneousValues: true }));
    });
    daiContract.on('Approval', (from, to, amount, event) => {
      this.chainEventLogRepository.save(plainToClass(ChainEventLog, event, { excludeExtraneousValues: true }));
    });
    daiContract.on('ApprovalForAll', (from, to, isApproval, event) => {
      this.chainEventLogRepository.save(plainToClass(ChainEventLog, event, { excludeExtraneousValues: true }));
    });
    daiContract.on('PunkOffered', (value1, value2, address, event) => {
      this.chainEventLogRepository.save(plainToClass(ChainEventLog, event, { excludeExtraneousValues: true }));
    });
    daiContract.on('PunkTransfer', (from, to, amount, event) => {
      this.chainEventLogRepository.save(plainToClass(ChainEventLog, event, { excludeExtraneousValues: true }));
    });
    return plainToClass(CreateSubscriptionsResponse, result, { excludeExtraneousValues: true });
  }

  async getSubscriptionList(): Promise<CreateSubscriptionsResponse[]> {
    const subcriptions: Subscriptions[] = await this.subscriptionsRepository.find();
    return plainToInstance(CreateSubscriptionsResponse, subcriptions);
  }

  async getSubscription(subscriptionId: number): Promise<GetSubscriptionsResponseDto> {
    const subscription: Subscriptions = await this.subscriptionsRepository
      .createQueryBuilder()
      .where('id = :id', { id: subscriptionId })
      .getOne();
    const where: FindOptionsWhere<ChainEventLog> = {
      address: subscription.contractAddress,
    };

    const [log, logSize]: [log: ChainEventLog[], logSize: number] = await this.chainEventLogRepository.findAndCountBy(
      where,
    );
    const summary: SummaryLog = plainToClass(SummaryLog, { logSize, firstLogTimestamp: log[0].createdAt });
    const subscriptions: GetSubscriptionsResponseDto = plainToClass(GetSubscriptionsResponseDto, {
      ...plainToClass(CreateSubscriptionsResponse, subscription),
      ...summary,
    });
    return subscriptions;
  }

  async deleteSubscription(subscriptionId: number): Promise<CreateSubscriptionsResponse> {
    const where: FindOptionsWhere<ChainEventLog> = {
      id: subscriptionId,
    };
    const subscription: Subscriptions = await this.subscriptionsRepository.findOneBy(where);

    if (!subscription) {
      throw new NotFoundSubcription(subscriptionId);
    }

    const events: string[] = Object.values(ABI);
    const infura = await new ethers.providers.InfuraProvider(process.env.NETWORK, process.env.API_KEY);
    const daiContract = new ethers.Contract(subscription.contractAddress, events, infura);

    daiContract.removeAllListeners();
    await this.subscriptionsRepository.softDelete(where);
    const result: Subscriptions = await this.subscriptionsRepository.findOne({ withDeleted: true, where });
    return plainToClass(CreateSubscriptionsResponse, result);
  }
}
