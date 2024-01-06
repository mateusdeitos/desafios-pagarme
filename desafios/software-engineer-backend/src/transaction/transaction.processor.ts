import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PayableService } from 'src/payable/payable.service';
import { Transaction } from './dtos';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { transaction } from 'drizzle/schema';

@Processor('process-transaction')
export class TransactionProcessor {
  constructor(
    private payableService: PayableService,
    private client: DrizzleService,
  ) {}

  @Process()
  async process(job: Job<Transaction>) {
    // process payables here
    const payable = await this.payableService.create(job.data);
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

  @OnQueueFailed()
  async onError(job: Job<Transaction>, error: Error) {
    console.log(`Error processing job ${error.message}`);
    if (job.attemptsMade < job.opts.attempts) {
      return;
    }

    await this.client.getDb().update(transaction).set({
      failedAt: new Date().toISOString(),
      failingReason: error.message,
    });
  }
}
