// import { roomModel } from "../models/roomModel";
// import { db } from "../config/dbConnection";

// type RoomInsert = {
//   roomNumber: number;
//   hostelBlock: string;
//   academicYear: string;
//   floor: number;
//   rollNo: string[] | null;
// };

// export const roomStructureAllocationService = async (
//   roomsToInsert: RoomInsert[]
// ) => {
//   const batchSize = 100;

//   await db.transaction(async (bt) => {
//     for (let i = 0; i < roomsToInsert.length; i += batchSize) {
//       const batch = roomsToInsert.slice(i, i + batchSize);
//       await bt.insert(roomModel).values(batch);
//     }
//   });

//   return {
//     count: roomsToInsert.length,
//   };
// };