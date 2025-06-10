CREATE TABLE "readmission" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"approval" "approval_status" NOT NULL,
	"academic_year" varchar(4) NOT NULL,
	"payment_id" serial NOT NULL,
	"student_name" text NOT NULL,
	"course" varchar(10) NOT NULL,
	"branch" varchar(50) NOT NULL,
	"year" varchar(2) NOT NULL,
	"semester" varchar(2) NOT NULL,
	"student_mobile" varchar(15) NOT NULL,
	"student_email" varchar(100) NOT NULL,
	"parent_mobile_1" varchar(15) NOT NULL,
	"parent_mobile_2" varchar(15),
	"parent_email" varchar(100),
	"guardian_name" text,
	"guardian_mobile" varchar(15),
	"address" text NOT NULL,
	"hostel_block" varchar(50) NOT NULL,
	"room_number" varchar(10) NOT NULL,
	"key_received" boolean NOT NULL,
	"fees_paid" boolean NOT NULL,
	"transaction_reference_no" varchar(50),
	"transaction_date" date,
	"amount" integer,
	"any_dues" boolean NOT NULL,
	"student_agreed" boolean NOT NULL,
	"parent_agreed" boolean NOT NULL,
	"submission_date" date NOT NULL
);
--> statement-breakpoint
ALTER TABLE "student" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "rc" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "student" CASCADE;--> statement-breakpoint
DROP TABLE "rc" CASCADE;--> statement-breakpoint
ALTER TABLE "admission" DROP CONSTRAINT "admission_roll_no_student_roll_no_fk";
--> statement-breakpoint
ALTER TABLE "admission" ALTER COLUMN "mess_preference" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "admission" ALTER COLUMN "hostel_block" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "admission" ALTER COLUMN "hostel_block" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "course" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "branch" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "semester" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "date_of_birth" date NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "age" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "mobile" varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "email" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "emergency_contact" varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "nationality" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "govt_id" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "admission_category" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "blood_group" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "medical_history" text NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "room_number" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "father_name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "father_occupation" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "father_mobile" varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "father_email" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "father_country" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "mother_name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "mother_occupation" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "mother_mobile" varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "mother_email" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "mother_country" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "res_india_house_no" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "res_india_street" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "res_india_city" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "res_india_state" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "res_india_country" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "res_india_postal_code" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "res_foreign_house_no" varchar(100);--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "res_foreign_street" varchar(100);--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "res_foreign_city" varchar(50);--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "res_foreign_state" varchar(50);--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "res_foreign_country" varchar(50);--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "res_foreign_postal_code" varchar(20);--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "local_guardian_name" varchar(100);--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "local_guardian_relationship" varchar(50);--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "local_guardian_mobile" varchar(15);--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "local_guardian_email" varchar(100);--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "guardian_house_no" varchar(100);--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "guardian_street" varchar(100);--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "guardian_city" varchar(50);--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "guardian_state" varchar(50);--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "guardian_country" varchar(50);--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "guardian_postal_code" varchar(20);--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "passport_photo_url" text;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "student_signature_url" text;--> statement-breakpoint
ALTER TABLE "admission" ADD COLUMN "parent_guardian_signature_url" text;--> statement-breakpoint
ALTER TABLE "admission" ADD CONSTRAINT "admission_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission" DROP COLUMN "academic_year";--> statement-breakpoint
ALTER TABLE "admission" DROP COLUMN "category";--> statement-breakpoint
DROP TYPE "public"."mess_preference";