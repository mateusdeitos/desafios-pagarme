import { z } from 'zod';
import { transactionCreateSchema } from './validation.schemas';
import { InferSelectModel } from 'drizzle-orm';
import { transaction } from 'drizzle/schema';

export type CreateTransactionDTO = z.infer<typeof transactionCreateSchema>;

export type Transaction = InferSelectModel<typeof transaction>;
