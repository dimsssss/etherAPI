import { ChainEventLog } from '../entity/ChainEventLog';
import { InjectRepository } from '@nestjs/typeorm';
import { ChainEventLogsRepository } from './ChainEventLogsRepository';
import { Repository, FindOptionsWhere, Raw } from 'typeorm';
import { Subscriptions } from '../entity/Subscriptions';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChainEventLogsRepositoryImple implements ChainEventLogsRepository {
  constructor(
    @InjectRepository(ChainEventLog)
    private chainEventLogRepository: Repository<ChainEventLog>,
  ) {}

  async save(chanEventLog: ChainEventLog): Promise<void> {
    await this.chainEventLogRepository.save(chanEventLog);
  }

  async countLog(address: string): Promise<number> {
    const where: FindOptionsWhere<ChainEventLog> = {
      address: address,
    };
    return await this.chainEventLogRepository.countBy(where);
  }

  async countLogBy(address: string, start?: number, end?: number): Promise<number> {
    const where: FindOptionsWhere<ChainEventLog> = {
      address: address,
      createdAt: Raw((value) => `${value} >= :start AND ${value} < :end`, {
        start: new Date(Number(start)),
        end: new Date(Number(end)),
      }),
    };
    return await this.chainEventLogRepository.countBy(where);
  }

  async findAndCountBy(subscription: Subscriptions): Promise<[log: ChainEventLog[], logSize: number]> {
    const where: FindOptionsWhere<ChainEventLog> = {
      address: subscription.contractAddress,
    };
    return await this.chainEventLogRepository.findAndCountBy(where);
  }
}
