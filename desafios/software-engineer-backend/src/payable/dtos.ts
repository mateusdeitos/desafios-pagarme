import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { payable } from 'drizzle/schema';

export type Payable = InferSelectModel<typeof payable>;

export type CreatePayableDTO = InferInsertModel<typeof payable>;
