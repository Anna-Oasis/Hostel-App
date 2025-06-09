CREATE TYPE "public"."mess_preference" AS ENUM('VEG', 'NON-VEG');--> statement-breakpoint
DROP TABLE "readmission" CASCADE;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "category" varchar(25) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "previous_resident" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "mess_preference" "mess_preference" NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "hostel_block" varchar(50);