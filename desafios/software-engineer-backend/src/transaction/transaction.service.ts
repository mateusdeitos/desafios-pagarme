import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { transaction } from '../../drizzle/schema';
import { CreateTransactionDTO } from './dtos';
import { desc, lt } from 'drizzle-orm';

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

  async list(cursor: number, limit = 10) {
    const db = this.client.getDb();
    const query = db
      .select()
      .from(transaction)
      .orderBy(desc(transaction.id))
      .limit(limit);

    if (cursor) {
      query.where(lt(transaction.id, cursor));
    }

    return query;
  }
}
