import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { EncryptionService } from 'src/shared/encryption.service';
import { ZodValidationPipe } from 'src/zod-validation-pipe.pipe';
import { CreateTransactionDTO } from './dtos';
import { ProcessTransactionProducer } from './transaction.producer';
import { TransactionService } from './transaction.service';
import { transactionCreateSchema } from './validation.schemas';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly processTransactionProducer: ProcessTransactionProducer,
    private readonly transactionService: TransactionService,
    private readonly encryptionService: EncryptionService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(transactionCreateSchema))
  async create(
    @Body() createTransactionDTO: CreateTransactionDTO,
    @Res() res: Response,
  ) {
    const transaction = await this.transactionService.create(
      createTransactionDTO,
    );
    await this.processTransactionProducer.enqueue(transaction);

    res.status(HttpStatus.CREATED).json({
      message: 'Transaction added to queue',
    });
  }

  @Get('/all')
  async list(@Query('cursor') cursor?: string) {
    const _cursor = await this.parseCursor(cursor);

    const limit = 10;

    const transactions = await this.transactionService.list(_cursor, limit + 1);
    const hasNextPage = transactions.length > limit;
    const data = transactions.slice(0, limit);

    const nextCursor = hasNextPage
      ? await this.getNextCursor(data.at(-1).id)
      : null;

    return {
      data,
      pagination: {
        nextCursor,
        hasNextPage,
      },
    };
  }

  private async parseCursor(cursor?: string) {
    if (!cursor) {
      return 0;
    }

    const parsed = await this.encryptionService.decrypt(cursor);
    return parseInt(parsed, 10);
  }

  private async getNextCursor(cursor: number) {
    return this.encryptionService.encrypt(cursor.toString());
  }
}
