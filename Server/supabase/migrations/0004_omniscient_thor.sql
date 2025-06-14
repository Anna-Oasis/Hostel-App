ALTER TABLE "student" RENAME COLUMN "passport_url" TO "category_proof_url";--> statement-breakpoint
ALTER TABLE "student" ALTER COLUMN "gender" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."gender";--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other', 'prefer not to say');--> statement-breakpoint
ALTER TABLE "student" ALTER COLUMN "gender" SET DATA TYPE "public"."gender" USING "gender"::"public"."gender";--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "updated_at" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "student" ADD COLUMN "govt_id_type" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "student" ADD COLUMN "updated_at" date DEFAULT now() NOT NULL;