import { OnQueueActive, OnQueueError, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TransactionService } from './transaction.service';
import { CreateTransactionDTO } from './dtos';

@Processor('new-transaction')
export class TransactionProcessor {
  constructor(private transactionService: TransactionService) {}

  @Process('create-transaction')
  async create(job: Job<CreateTransactionDTO>) {
    await this.transactionService.create(job.data);
    console.log('Job done');
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
        null,
        2,
      )}...`,
    );
  }

  @OnQueueError()
  onError(error: Error) {
    console.log(`Error processing job ${error.message}`);
  }
}
