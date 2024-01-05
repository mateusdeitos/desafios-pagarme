import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/transaction/dtos';

@Injectable()
export class FeesService {
  getFeeForTransaction(transaction: Transaction) {
    if (transaction.paymentMethod === 'debit_card') {
      return 3;
    }

    return 5;
  }
}
