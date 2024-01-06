import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { payable, transaction } from 'drizzle/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { Transaction } from 'src/transaction/dtos';
import { CreatePayableDTO, Payable } from './dtos';
import { FeesService } from './fees.service';

@Injectable()
export class PayableService {
  constructor(
    private client: DrizzleService,
    private readonly feesService: FeesService,
  ) {}

  async create(_transaction: Transaction) {
    let status: Payable['status'] = 'paid';
    const paymentDate = new Date(_transaction.createdAt);

    if (_transaction.paymentMethod === 'credit_card') {
      status = 'waiting_funds';
      paymentDate.setDate(paymentDate.getDate() + 30);
    }

    const fee = this.feesService.getFeeForTransaction(_transaction);

    const createPayableDTO: CreatePayableDTO = {
      amount: _transaction.amount * (1 - fee / 100),
      fee,
      paymentDate: paymentDate.toISOString(),
      status,
      transactionId: _transaction.id,
    };

    const db = this.client.getDb();
    const [payableData] = await db.transaction(async (tx) => {
      await tx
        .select({ id: transaction.id })
        .from(transaction)
        .where(eq(transaction.id, _transaction.id))
        .for('update');

      await tx.insert(payable).values(createPayableDTO).onConflictDoNothing();

      await tx
        .update(transaction)
        .set({ processedAt: new Date().toISOString() })
        .where(eq(transaction.id, _transaction.id));

      const payableData = await tx
        .select()
        .from(payable)
        .where(eq(payable.transactionId, _transaction.id));

      return payableData;
    });

    return payableData;
  }
}
