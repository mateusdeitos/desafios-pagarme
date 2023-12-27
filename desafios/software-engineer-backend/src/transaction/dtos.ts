import { z } from 'zod';
import { transactionCreateSchema } from './validation.schemas';

export type CreateTransactionDTO = z.infer<typeof transactionCreateSchema>;
