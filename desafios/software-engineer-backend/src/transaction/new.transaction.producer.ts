import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateTransactionDTO } from './dtos';

@Injectable()
export class NewTransactionProducer {
  constructor(
    @InjectQueue('new-transaction') private newTransactionQueue: Queue,
  ) {}

  async enqueue(payload: CreateTransactionDTO) {
    await this.newTransactionQueue.add('create-transaction', payload, {
      jobId: this.buildJobId(payload),
      delay: 3000,
      attempts: 3,
      backoff: 1000,
      timeout: 5000,
    });
  }

  private buildJobId(payload: CreateTransactionDTO) {
    // deduplicate jobs in the same minute
    const parts = [
      payload.cardNumber,
      payload.cardExpirationDate,
      payload.amount,
      new Date().getMinutes(),
    ];

    return parts.join('|');
  }
}
