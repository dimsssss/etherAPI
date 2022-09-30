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
    const infura = await new ethers.providers.InfuraProvider('homestead', '31a0448161bd4c9c9dcb5cf5fa715cd4');
    const daiAbi: string[] = [
      'event Transfer(address indexed from, address indexed to, uint256 amount)',
      'event Approval(address indexed from, address indexed to, uint256 amount)',
      'event ApprovalForAll(address indexed from, address indexed to, bool isApproval)',
      'event PunkOffered(uint256, uint256, address)',
      'event PunkTransfer(address, address, uint256)',
    ];

    const daiContract = new ethers.Contract(subcriptions.contractAddress, daiAbi, infura);

    daiContract.on('Transfer', (from, to, amount, event) => {
      this.chainEventLogRepository.save(plainToClass(ChainEventLog, event));
    });
    daiContract.on('Approval', (from, to, amount, event) => {
      this.chainEventLogRepository.save(plainToClass(ChainEventLog, event));
    });
    daiContract.on('ApprovalForAll', (from, to, isApproval, event) => {
      this.chainEventLogRepository.save(plainToClass(ChainEventLog, event));
    });
    daiContract.on('PunkOffered', (value1, value2, address, event) => {
      this.chainEventLogRepository.save(plainToClass(ChainEventLog, event));
    });
    daiContract.on('PunkTransfer', (from, to, amount, event) => {
      this.chainEventLogRepository.save(plainToClass(ChainEventLog, event));
    });
    return plainToClass(CreateSubscriptionsResponse, result);
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
}
