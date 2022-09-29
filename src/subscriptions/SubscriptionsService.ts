import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscriptions } from './entity/Subscriptions';
import { CreateSubscriptionsResponse } from './dto/CreateSubscriptionsResponse';
import { CreateSubscriptions } from './dto/CreateSubscriptions';
import { ethers } from 'ethers';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscriptions)
    private subscriptionsRepository: Repository<Subscriptions>,
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
      console.log(`Transfer ${from} sent ${ethers.utils.formatEther(amount)} to ${to}`);
    });
    daiContract.on('Approval', (from, to, amount, event) => {
      console.log(`Approval ${from} sent ${ethers.utils.formatEther(amount)} to ${to}`);
    });
    daiContract.on('ApprovalForAll', (from, to, isApproval, event) => {
      console.log(`ApprovalForAll ${from} sent ${isApproval} to ${to}`);
    });
    daiContract.on('PunkOffered', (value1, value2, address, event) => {
      console.log(`PunkOffered ${value1}  ${value2} to ${address}`);
    });
    daiContract.on('PunkTransfer', (from, to, amount, event) => {
      console.log(`PunkTransfer ${from} sent ${ethers.utils.formatEther(amount)} to ${to}`);
    });
    return plainToClass(CreateSubscriptionsResponse, result);
  }

  async getSubscriptionList(): Promise<CreateSubscriptionsResponse[]> {
    const subcriptions: Subscriptions[] = await this.subscriptionsRepository.find();
    return plainToInstance(CreateSubscriptionsResponse, subcriptions);
  }
}
