import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, DrizzleService],
})
export class TransactionModule {}
