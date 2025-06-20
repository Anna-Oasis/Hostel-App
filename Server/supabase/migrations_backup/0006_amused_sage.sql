ALTER TABLE "admission" ALTER COLUMN "submission_date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "admission" ALTER COLUMN "submission_date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "admission" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "admission" ALTER COLUMN "updated_at" SET DEFAULT now();