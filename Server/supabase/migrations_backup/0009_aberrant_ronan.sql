CREATE TYPE "public"."rcLeave_status" AS ENUM('0', '1', '2', '-1');--> statement-breakpoint
ALTER TABLE "rc" DROP CONSTRAINT "rc_rc_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "rc_leave" ALTER COLUMN "approved" SET DEFAULT '0'::"public"."rcLeave_status";--> statement-breakpoint
ALTER TABLE "rc_leave" ALTER COLUMN "approved" SET DATA TYPE "public"."rcLeave_status" USING "approved"::"public"."rcLeave_status";--> statement-breakpoint
ALTER TABLE "leave_form" ADD COLUMN "address_of_stay" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "rc_leave" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "rc_leave" ADD COLUMN "approved_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "rc_leave" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "rc" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "rc" ADD COLUMN "alternate_rc_id" integer;--> statement-breakpoint
ALTER TABLE "summer_vacation" ADD COLUMN "vacation_time" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "summer_vacation" ADD COLUMN "address_of_stay" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "summer_vacation" ADD COLUMN "returned_items" varchar(100)[];--> statement-breakpoint
ALTER TABLE "vacating_hostel" ADD COLUMN "vacating_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "vacating_hostel" ADD COLUMN "vacating_time" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "vacating_hostel" ADD COLUMN "future_address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "rc" ADD CONSTRAINT "rc_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grievances" DROP COLUMN "priority";--> statement-breakpoint
ALTER TABLE "leave_form" DROP COLUMN "destination";--> statement-breakpoint
ALTER TABLE "summer_vacation" DROP COLUMN "vacation_to";--> statement-breakpoint
ALTER TABLE "summer_vacation" DROP COLUMN "reason";--> statement-breakpoint
ALTER TABLE "summer_vacation" DROP COLUMN "destination";--> statement-breakpoint
ALTER TABLE "summer_vacation" DROP COLUMN "contact_during_vacation";--> statement-breakpoint
ALTER TABLE "summer_vacation" DROP COLUMN "local_guardian_consent";--> statement-breakpoint
ALTER TABLE "vacating_hostel" DROP COLUMN "reason_for_vacating";--> statement-breakpoint
ALTER TABLE "vacating_hostel" DROP COLUMN "last_date_of_stay";--> statement-breakpoint
ALTER TABLE "vacating_hostel" DROP COLUMN "forwarding_address";--> statement-breakpoint
ALTER TABLE "vacating_hostel" DROP COLUMN "contact_after_vacating";--> statement-breakpoint
ALTER TABLE "vacating_hostel" DROP COLUMN "room_condition";--> statement-breakpoint
ALTER TABLE "vacating_hostel" DROP COLUMN "dues_clearance";--> statement-breakpoint
ALTER TABLE "vacating_hostel" DROP COLUMN "key_submitted";--> statement-breakpoint
ALTER TABLE "rc" ADD CONSTRAINT "rc_user_id_unique" UNIQUE("user_id");