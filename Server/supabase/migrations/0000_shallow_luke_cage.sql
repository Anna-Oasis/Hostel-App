CREATE TYPE "public"."approval_status" AS ENUM('0', '1', '2', '3', '4', '-1,');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('STUDENT', 'MANAGER', 'RC', 'DEPUTY_WARDEN', 'EXECUTIVE_WARDEN');--> statement-breakpoint
CREATE TABLE "admission_approvals" (
	"admission_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"approve" boolean NOT NULL,
	"comment" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admission" (
	"id" serial PRIMARY KEY NOT NULL,
	"roll_number" varchar(20) NOT NULL,
	"academic_year" varchar(9) NOT NULL,
	"declaration" boolean NOT NULL,
	"transaction_id" varchar(100) NOT NULL,
	"status" "approval_status" DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"rc_id" integer NOT NULL,
	"hostel" varchar(50) NOT NULL,
	"floor" integer NOT NULL,
	"no_present" integer NOT NULL,
	"no_absent" integer NOT NULL,
	"absentee" varchar(20)[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "caution_deposit_refund" (
	"vacating_hostel_id" integer NOT NULL,
	"deductions" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"refund_amount" numeric(10, 2) NOT NULL,
	"deduction_details" text,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "caution_deposit_refund_vacating_hostel_id_unique" UNIQUE("vacating_hostel_id")
);
--> statement-breakpoint
CREATE TABLE "grievances" (
	"id" serial PRIMARY KEY NOT NULL,
	"roll_number" varchar(20) NOT NULL,
	"grievance_type" varchar(50) NOT NULL,
	"subject" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"priority" varchar(20) DEFAULT 'medium' NOT NULL,
	"rc_approval" boolean DEFAULT false NOT NULL,
	"resolved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leave_form" (
	"id" serial PRIMARY KEY NOT NULL,
	"roll_number" varchar(20) NOT NULL,
	"leave_type" varchar(50) NOT NULL,
	"from_date" date NOT NULL,
	"to_date" date NOT NULL,
	"reason" text NOT NULL,
	"destination" varchar(100) NOT NULL,
	"emergency_contact" varchar(15) NOT NULL,
	"status" "approval_status" DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leave_form_approvals" (
	"leave_form_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"approve" boolean NOT NULL,
	"comment" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rc_leave" (
	"id" serial PRIMARY KEY NOT NULL,
	"rc_id" integer NOT NULL,
	"leaving" date NOT NULL,
	"arrival" date NOT NULL,
	"reason" text NOT NULL,
	"approved" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rc" (
	"rc_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"hostel" varchar(50) NOT NULL,
	"on_leave" boolean,
	"floor" integer[] NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student" (
	"user_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"roll_no" varchar(20) PRIMARY KEY NOT NULL,
	"course" varchar(50) NOT NULL,
	"branch" varchar(50) NOT NULL,
	"semester" varchar(10) NOT NULL,
	"date_of_birth" date NOT NULL,
	"age" integer NOT NULL,
	"mobile" varchar(15) NOT NULL,
	"email" varchar(100) NOT NULL,
	"emergency_contact" varchar(15) NOT NULL,
	"nationality" varchar(50) NOT NULL,
	"govt_id" varchar(50) NOT NULL,
	"admission_category" varchar(20) NOT NULL,
	"blood_group" varchar(10) NOT NULL,
	"medical_history" text NOT NULL,
	"previous_resident" boolean NOT NULL,
	"hostel_block" varchar(20) NOT NULL,
	"room_number" varchar(10) NOT NULL,
	"mess_preference" varchar(20) NOT NULL,
	"father_name" varchar(100) NOT NULL,
	"father_occupation" varchar(100) NOT NULL,
	"father_mobile" varchar(15) NOT NULL,
	"father_email" varchar(100) NOT NULL,
	"father_country" varchar(50) NOT NULL,
	"mother_name" varchar(100) NOT NULL,
	"mother_occupation" varchar(100) NOT NULL,
	"mother_mobile" varchar(15) NOT NULL,
	"mother_email" varchar(100) NOT NULL,
	"mother_country" varchar(50) NOT NULL,
	"res_india_house_no" varchar(100) NOT NULL,
	"res_india_street" varchar(100) NOT NULL,
	"res_india_city" varchar(50) NOT NULL,
	"res_india_state" varchar(50) NOT NULL,
	"res_india_country" varchar(50) NOT NULL,
	"res_india_postal_code" varchar(20) NOT NULL,
	"res_foreign_house_no" varchar(100),
	"res_foreign_street" varchar(100),
	"res_foreign_city" varchar(50),
	"res_foreign_state" varchar(50),
	"res_foreign_country" varchar(50),
	"res_foreign_postal_code" varchar(20),
	"local_guardian_name" varchar(100),
	"local_guardian_relationship" varchar(50),
	"local_guardian_mobile" varchar(15),
	"local_guardian_email" varchar(100),
	"guardian_house_no" varchar(100),
	"guardian_street" varchar(100),
	"guardian_city" varchar(50),
	"guardian_state" varchar(50),
	"guardian_country" varchar(50),
	"guardian_postal_code" varchar(20),
	"created_at" date DEFAULT now() NOT NULL,
	"passport_photo_url" text,
	"student_signature_url" text,
	"parent_guardian_signature_url" text
);
--> statement-breakpoint
CREATE TABLE "summer_vacation" (
	"id" serial PRIMARY KEY NOT NULL,
	"roll_number" varchar(20) NOT NULL,
	"vacation_from" date NOT NULL,
	"vacation_to" date NOT NULL,
	"reason" text NOT NULL,
	"destination" varchar(100) NOT NULL,
	"contact_during_vacation" varchar(15) NOT NULL,
	"local_guardian_consent" varchar(3) NOT NULL,
	"status" "approval_status" DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "summer_vacation_approvals" (
	"summer_vacation_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"approve" boolean NOT NULL,
	"comment" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" text NOT NULL,
	"role" varchar(20) DEFAULT 'student' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vacating_hostel" (
	"id" serial PRIMARY KEY NOT NULL,
	"roll_number" varchar(20) NOT NULL,
	"reason_for_vacating" varchar(100) NOT NULL,
	"last_date_of_stay" date NOT NULL,
	"forwarding_address" text NOT NULL,
	"contact_after_vacating" varchar(15) NOT NULL,
	"room_condition" text NOT NULL,
	"dues_clearance" varchar(3) DEFAULT 'No' NOT NULL,
	"key_submitted" varchar(3) DEFAULT 'No' NOT NULL,
	"status" "approval_status" DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vacating_hostel_approvals" (
	"vacating_hostel_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"approve" boolean NOT NULL,
	"comment" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admission_approvals" ADD CONSTRAINT "admission_approvals_admission_id_admission_id_fk" FOREIGN KEY ("admission_id") REFERENCES "public"."admission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_approvals" ADD CONSTRAINT "admission_approvals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission" ADD CONSTRAINT "admission_roll_number_student_roll_no_fk" FOREIGN KEY ("roll_number") REFERENCES "public"."student"("roll_no") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_rc_id_rc_rc_id_fk" FOREIGN KEY ("rc_id") REFERENCES "public"."rc"("rc_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "caution_deposit_refund" ADD CONSTRAINT "caution_deposit_refund_vacating_hostel_id_vacating_hostel_id_fk" FOREIGN KEY ("vacating_hostel_id") REFERENCES "public"."vacating_hostel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_roll_number_student_roll_no_fk" FOREIGN KEY ("roll_number") REFERENCES "public"."student"("roll_no") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_form" ADD CONSTRAINT "leave_form_roll_number_student_roll_no_fk" FOREIGN KEY ("roll_number") REFERENCES "public"."student"("roll_no") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_form_approvals" ADD CONSTRAINT "leave_form_approvals_leave_form_id_leave_form_id_fk" FOREIGN KEY ("leave_form_id") REFERENCES "public"."leave_form"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_form_approvals" ADD CONSTRAINT "leave_form_approvals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rc_leave" ADD CONSTRAINT "rc_leave_rc_id_rc_rc_id_fk" FOREIGN KEY ("rc_id") REFERENCES "public"."rc"("rc_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rc" ADD CONSTRAINT "rc_rc_id_users_id_fk" FOREIGN KEY ("rc_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "summer_vacation" ADD CONSTRAINT "summer_vacation_roll_number_student_roll_no_fk" FOREIGN KEY ("roll_number") REFERENCES "public"."student"("roll_no") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "summer_vacation_approvals" ADD CONSTRAINT "summer_vacation_approvals_summer_vacation_id_summer_vacation_id_fk" FOREIGN KEY ("summer_vacation_id") REFERENCES "public"."summer_vacation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "summer_vacation_approvals" ADD CONSTRAINT "summer_vacation_approvals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vacating_hostel" ADD CONSTRAINT "vacating_hostel_roll_number_student_roll_no_fk" FOREIGN KEY ("roll_number") REFERENCES "public"."student"("roll_no") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vacating_hostel_approvals" ADD CONSTRAINT "vacating_hostel_approvals_vacating_hostel_id_vacating_hostel_id_fk" FOREIGN KEY ("vacating_hostel_id") REFERENCES "public"."vacating_hostel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vacating_hostel_approvals" ADD CONSTRAINT "vacating_hostel_approvals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;