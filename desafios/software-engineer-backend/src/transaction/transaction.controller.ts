import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationPipe } from 'src/zod-validation-pipe.pipe';
import { CreateTransactionDTO } from './dtos';
import { ProcessTransactionProducer } from './transaction.producer';
import { transactionCreateSchema } from './validation.schemas';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly processTransactionProducer: ProcessTransactionProducer,
    private readonly transactionService: TransactionService,
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
}
