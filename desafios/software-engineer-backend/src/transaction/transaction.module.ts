import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { BullModule } from '@nestjs/bull';
import { TransactionProcessor } from './transaction.processor';
import { ProcessTransactionProducer } from './transaction.producer';
import { PayableService } from 'src/payable/payable.service';
import { FeesService } from 'src/payable/fees.service';
import { EncryptionService } from 'src/shared/encryption.service';

@Module({
  controllers: [TransactionController],
  providers: [
    TransactionService,
    DrizzleService,
    TransactionProcessor,
    ProcessTransactionProducer,
    PayableService,
    FeesService,
    EncryptionService,
  ],
  imports: [
    BullModule.registerQueue({
      name: 'process-transaction',
    }),
  ],
})
export class TransactionModule {}
