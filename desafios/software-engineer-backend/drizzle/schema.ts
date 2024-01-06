import {
  bigint,
  date,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const status = pgEnum('status', ['waiting_funds', 'paid']);
export const paymentMethod = pgEnum('payment_method', [
  'credit_card',
  'debit_card',
]);

export const payable = pgTable('payable', {
  id: serial('id').primaryKey().notNull(),
  status: status('status'),
  paymentDate: date('payment_date').notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  amount: bigint('amount', { mode: 'number' }).notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  fee: bigint('fee', { mode: 'number' }).notNull(),
  transactionId: serial('transaction_id')
    .notNull()
    .references(() => transaction.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .unique(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
});

export const transaction = pgTable('transaction', {
  id: serial('id').primaryKey().notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  amount: bigint('amount', { mode: 'number' }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  paymentMethod: paymentMethod('payment_method'),
  cardNumber: varchar('card_number', { length: 4 }).notNull(),
  cardOwner: varchar('card_owner', { length: 255 }).notNull(),
  cardExpirationDate: varchar('card_expiration_date', { length: 7 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  processedAt: timestamp('processed_at', { mode: 'string' }),
  failedAt: timestamp('failed_at', { mode: 'string' }),
  failingReason: varchar('failing_reason', { length: 255 }),
});
