import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateTransactionDTO } from './dtos';

@Injectable()
export class ProcessTransactionProducer {
  constructor(
    @InjectQueue('process-transaction')
    private processNewTransactionQueue: Queue,
  ) {}

  async enqueue(payload: CreateTransactionDTO) {
    await this.processNewTransactionQueue.add(payload, {
      delay: 3000,
      attempts: 3,
      backoff: 1000,
      timeout: 5000,
    });
  }
}
