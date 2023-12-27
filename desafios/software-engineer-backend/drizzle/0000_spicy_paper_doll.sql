DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('paid', 'waiting_funds');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "payment_method" AS ENUM('debit_card', 'credit_card');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payable" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" "status",
	"payment_date" date NOT NULL,
	"amount" bigint NOT NULL,
	"fee" bigint NOT NULL,
	"transaction_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" bigint NOT NULL,
	"description" varchar(255) NOT NULL,
	"payment_method" "payment_method",
	"card_number" varchar(4) NOT NULL,
	"card_owner" varchar(255) NOT NULL,
	"card_expiration_date" varchar(7) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payable" ADD CONSTRAINT "payable_transaction_id_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
