import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { BullModule } from '@nestjs/bull';
import { TransactionProcessor } from './transaction.processor';
import { NewTransactionProducer } from './new.transaction.producer';

@Module({
  controllers: [TransactionController],
  providers: [
    TransactionService,
    DrizzleService,
    TransactionProcessor,
    NewTransactionProducer,
  ],
  imports: [
    BullModule.registerQueue({
      name: 'new-transaction',
    }),
  ],
})
export class TransactionModule {}
