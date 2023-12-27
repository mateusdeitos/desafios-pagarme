import { createInsertSchema } from 'drizzle-zod';
import { transaction } from 'src/schema';
import { z } from 'zod';

export const transactionCreateSchema = createInsertSchema(transaction, {
  amount: z.number(),
  cardExpirationDate: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Must be in format 'YYYY-MM'"),
  cardNumber: z
    .string()
    .length(19, 'Must be in format "XXXX XXXX XXXX XXXX"')
    .transform((value) => value.slice(-4)),
}).omit({
  id: true,
});
