ALTER TYPE "public"."user_role" ADD VALUE 'salesman';--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"transaction_ref" text NOT NULL,
	"external_ref" text,
	"user_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"items" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_transactions_transaction_ref_key" UNIQUE("transaction_ref")
);
--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "fk_payment_transactions_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;