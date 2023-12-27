import {
  bigint,
  date,
  pgEnum,
  pgTable,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';

const id = (name = 'id') => serial(name);

export const paymentMethodEnum = pgEnum('payment_method', [
  'debit_card',
  'credit_card',
]);

export const payableStatusEnum = pgEnum('status', ['paid', 'waiting_funds']);

export const transaction = pgTable('transaction', {
  id: id().primaryKey(),
  amount: bigint('amount', { mode: 'number' }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  paymentMethod: paymentMethodEnum('payment_method'),
  cardNumber: varchar('card_number', { length: 4 }).notNull(),
  cardOwner: varchar('card_owner', { length: 255 }).notNull(),
  cardExpirationDate: varchar('card_expiration_date', { length: 7 }).notNull(),
});

export const payable = pgTable('payable', {
  id: id().primaryKey(),
  status: payableStatusEnum('status'),
  paymentDate: date('payment_date').notNull(),
  amount: bigint('amount', { mode: 'number' }).notNull(),
  fee: bigint('fee', { mode: 'number' }).notNull(),
  transactionId: id('transaction_id').references(() => transaction.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
});
