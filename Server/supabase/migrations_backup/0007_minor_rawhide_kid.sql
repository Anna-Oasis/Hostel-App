CREATE TYPE "public"."hostel_block" AS ENUM('Flora', 'Lavender');--> statement-breakpoint
ALTER TABLE "student" ALTER COLUMN "gender" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."gender";--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
ALTER TABLE "student" ALTER COLUMN "gender" SET DATA TYPE "public"."gender" USING "gender"::"public"."gender";--> statement-breakpoint
ALTER TABLE "rc" ALTER COLUMN "hostel" SET DATA TYPE "public"."hostel_block" USING "hostel"::"public"."hostel_block";--> statement-breakpoint
ALTER TABLE "rc" ALTER COLUMN "on_leave" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "rc" ALTER COLUMN "on_leave" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rc" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "rc" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "student" ADD COLUMN "room_number" integer;--> statement-breakpoint
ALTER TABLE "vacating_hostel" ADD COLUMN "returned_items" varchar(100)[];--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_room_number_room_room_number_fk" FOREIGN KEY ("room_number") REFERENCES "public"."room"("room_number") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission" DROP COLUMN "room_number";--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_unique" UNIQUE("user_id");