CREATE TYPE "public"."approval_status" AS ENUM('1', '2', '3');--> statement-breakpoint
CREATE TABLE "admission" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"approval" "approval_status" NOT NULL,
	"academic_year" varchar(4) NOT NULL,
	"payment_id" serial NOT NULL
);
