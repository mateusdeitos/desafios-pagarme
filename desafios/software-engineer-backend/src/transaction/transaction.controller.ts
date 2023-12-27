import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/zod-validation-pipe.pipe';
import { TransactionService } from './transaction.service';
import { transactionCreateSchema } from './validation.schemas';
import { CreateTransactionDTO } from './dtos';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(transactionCreateSchema))
  async create(@Body() createTransactionDTO: CreateTransactionDTO) {
    return this.transactionService.create(createTransactionDTO);
  }
}
