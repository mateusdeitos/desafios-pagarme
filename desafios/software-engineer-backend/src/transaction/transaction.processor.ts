import { OnQueueActive, OnQueueError, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PayableService } from 'src/payable/payable.service';
import { Transaction } from './dtos';

@Processor('process-transaction')
export class TransactionProcessor {
  constructor(private payableService: PayableService) {}

  @Process()
  async process(job: Job<Transaction>) {
    // process payables here
    const transaction = job.data;
    const payable = await this.payableService.create(transaction);
    console.log(`Payable created: ${JSON.stringify(payable, null, 2)}`);
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
