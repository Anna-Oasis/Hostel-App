CREATE TABLE "room" (
	"room_number" integer NOT NULL,
	"hostel_block" varchar(20) NOT NULL,
	"academic_year" varchar(9) NOT NULL,
	"floor" integer NOT NULL,
	"rollNo" varchar(20)[],
	CONSTRAINT "room_room_number_hostel_block_academic_year_pk" PRIMARY KEY("room_number","hostel_block","academic_year")
);
