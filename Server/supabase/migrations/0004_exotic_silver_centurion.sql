CREATE TABLE "Admissionn" (
	"admission_id" serial PRIMARY KEY NOT NULL,
	"roll_no" varchar(20) NOT NULL,
	"academic_year" varchar(15) NOT NULL,
	"approval" "approval_status" NOT NULL,
	"student_declaration" boolean NOT NULL,
	"parent_declaration" boolean NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"transaction_id" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userss" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" text NOT NULL,
	"role" varchar(20) DEFAULT 'student' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "userss_email_unique" UNIQUE("email")
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
CREATE TABLE "RC" (
	"rc_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"hostel" varchar(50) NOT NULL,
	"on_leave" boolean,
	"floor" integer[] NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "admission" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "Admissionn" ADD CONSTRAINT "Admissionn_roll_no_student_roll_no_fk" FOREIGN KEY ("roll_no") REFERENCES "public"."student"("roll_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_userss_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."userss"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "RC" ADD CONSTRAINT "RC_rc_id_userss_id_fk" FOREIGN KEY ("rc_id") REFERENCES "public"."userss"("id") ON DELETE no action ON UPDATE no action;