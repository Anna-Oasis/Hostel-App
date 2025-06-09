ALTER TABLE "admission" RENAME COLUMN "declaration" TO "student_agreed";--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "parent_agreed" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "admission_category" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "previous_resident" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "hostel_block" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "room_number" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "mess_preference" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "submission_date" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "student" DROP COLUMN "admission_category";--> statement-breakpoint
ALTER TABLE "student" DROP COLUMN "previous_resident";--> statement-breakpoint
ALTER TABLE "student" DROP COLUMN "hostel_block";--> statement-breakpoint
ALTER TABLE "student" DROP COLUMN "room_number";--> statement-breakpoint
ALTER TABLE "student" DROP COLUMN "mess_preference";