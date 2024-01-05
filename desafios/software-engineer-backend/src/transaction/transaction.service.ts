import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { transaction } from '../../drizzle/schema';
import { CreateTransactionDTO } from './dtos';

@Injectable()
export class TransactionService {
  constructor(private client: DrizzleService) {}

  async create(payload: CreateTransactionDTO) {
    const db = this.client.getDb();
    const [result] = await db
      .insert(transaction)
      .values({
        amount: payload.amount * 100,
        cardExpirationDate: payload.cardExpirationDate,
        cardNumber: payload.cardNumber.split(' ').at(-1),
        cardOwner: payload.cardOwner,
        description: payload.description,
        paymentMethod: payload.paymentMethod,
      })
      .returning();
    return result;
  }
}
