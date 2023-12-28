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
import { NewTransactionProducer } from './new.transaction.producer';
import { transactionCreateSchema } from './validation.schemas';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly newTransactionProducer: NewTransactionProducer,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(transactionCreateSchema))
  async enqueueNewTransaction(
    @Body() createTransactionDTO: CreateTransactionDTO,
    @Res() res: Response,
  ) {
    await this.newTransactionProducer.enqueue(createTransactionDTO);

    res.status(HttpStatus.CREATED).json({
      message: 'Transaction added to queue',
    });
  }
}
