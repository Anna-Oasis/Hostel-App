// type RoomInsert = {
//   roomNumber: number;
//   hostelBlock: string;
//   academicYear: string;
//   floor: number;
//   rollNo: string[] | null;
// };

// export const buildRoomStructure = (academicYear: string): RoomInsert[] => {
//   const rooms: RoomInsert[] = [];

//   const addRooms = (
//     start: number,
//     end: number,
//     block: string,
//     floor: number
//   ) => {
//     for (let num = start; num <= end; num++) {
//       rooms.push({
//         roomNumber: num,
//         hostelBlock: block,
//         academicYear,
//         floor,
//         rollNo: null,
//       });
//     }
//   };

//   // Flora
//   addRooms(111, 118, "Flora", 0);
//   addRooms(201, 218, "Flora", 1);
//   addRooms(301, 318, "Flora", 2);
//   addRooms(319, 336, "Flora", 2);
//   addRooms(401, 418, "Flora", 3);
//   addRooms(419, 436, "Flora", 3);

//   // Lavender
//   addRooms(101, 118, "Lavender", 0);
//   addRooms(201, 218, "Lavender", 1);
//   addRooms(301, 318, "Lavender", 2);
//   addRooms(401, 418, "Lavender", 3);

//   return rooms;
// };