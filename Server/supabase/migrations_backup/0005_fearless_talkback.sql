DROP TYPE "public"."approval_status";--> statement-breakpoint
CREATE TYPE "public"."approval_status" AS ENUM('0', '1', '2', '3', '4', '-1');