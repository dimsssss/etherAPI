import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Subscriptions } from '../entity/Subscriptions';
import { SubscriptionRepository } from './SubscriptionRepository';
import { CreateSubscriptions } from '../dto/CreateSubscriptions';
import { Injectable } from '@nestjs/common';
import { ChainEventLog } from '../entity/ChainEventLog';

@Injectable()
export class SubscriptionRepositoryImpl implements SubscriptionRepository {
  constructor(
    @InjectRepository(Subscriptions)
    private subscriptionRepository: Repository<Subscriptions>,
  ) {}
  async save(subcriptions: CreateSubscriptions): Promise<Subscriptions> {
    return await this.subscriptionRepository.save(subcriptions);
  }

  async findOne(subscriptionId: number): Promise<Subscriptions> {
    const subscription: Subscriptions = await this.subscriptionRepository
      .createQueryBuilder()
      .where('id = :id', { id: subscriptionId })
      .getOne();
    return subscription;
  }

  async findDeleted(subscriptionId: number, withDeleted: boolean): Promise<Subscriptions> {
    const where: FindOptionsWhere<Subscriptions> = {
      id: subscriptionId,
    };
    return await this.subscriptionRepository.findOne({ withDeleted, where });
  }

  async find(): Promise<Subscriptions[]> {
    return await this.subscriptionRepository.find();
  }

  async findBy(subscriptionId: number, offset: number, limit: number): Promise<ChainEventLog[]> {
    try {
      return await this.subscriptionRepository
        .createQueryBuilder('s')
        .leftJoin(ChainEventLog, 'cel', 'cel.address = s.contractAddress', {})
        .select('cel.*')
        .where('s.id = :id', { id: Number(subscriptionId) })
        .offset(Number(offset))
        .limit(Number(limit))
        .getRawMany();
    } catch (err) {
      throw new Error(err);
    }
  }

  async findOneBy(subscriptionId: number) {
    const where: FindOptionsWhere<Subscriptions> = {
      id: subscriptionId,
    };
    return await this.subscriptionRepository.findOneBy(where);
  }

  async softDelete(subscriptionId: number): Promise<void> {
    const where: FindOptionsWhere<Subscriptions> = {
      id: subscriptionId,
    };
    this.subscriptionRepository.softDelete(where);
  }
}
