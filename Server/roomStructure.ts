// import { roomModel } from "./models/roomModel";
// import { declarationModel } from "./models/declarationModel";
// import * as readline from 'readline';
// import process from 'node:process';

// import { config } from 'dotenv';
// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import { logger } from './utils/logger';

// config({ path: '.env' }); 

// let db: ReturnType<typeof drizzle>;

// // Create readline interface for user input
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// export async function initDb() {
//   const client = postgres(process.env.DATABASE_URL!);
//   try {
//     await client`SELECT 1`;
//     logger.config('Database connected successfully');
//     db = drizzle(client);
//   } catch (err) {
//     logger.error(`Database connection failed: ${err}`);
//     process.exit(1);
//   }
// }

// export { db };


// // Helper function to prompt user input
// function prompt(question: string): Promise<string> {
//   return new Promise((resolve) => {
//     rl.question(question, (answer:any) => {
//       resolve(answer.trim());
//     });
//   });
// }

// // Helper function to validate academic year format (e.g., "2024-2025")
// function isValidAcademicYear(year: string): boolean {
//   const regex = /^\d{4}-\d{4}$/;
//   return regex.test(year);
// }

// async function insertRoomStructure() {
//   try {
//     // Initialize database connection first
//     await initDb();

//     console.log("Hostel Room Structure Setup");
//     console.log("===============================\n");

//     // Get academic year
//     let academicYear: string;
//     do {
//       academicYear = await prompt("Enter academic year (format: YYYY-YYYY, e.g., 2024-2025): ");
//       if (!isValidAcademicYear(academicYear)) {
//         console.log("Invalid format! Please use YYYY-YYYY format.");
//       }
//     } while (!isValidAcademicYear(academicYear));

//     console.log(`\nAcademic Year: ${academicYear}`);

//     // Only student rooms as per your structure
//     const roomsToInsert: Array<{
//       roomNumber: number;
//       hostelBlock: string;
//       academicYear: string;
//       floor: number;
//       rollNo: string[] | null;
//     }> = [];

//     // Flora Hostel
//     // Ground Floor: Students Rooms (111-118)
//     for (let num = 111; num <= 118; num++) {
//       roomsToInsert.push({
//         roomNumber: num,
//         hostelBlock: "Flora",
//         academicYear,
//         floor: 0,
//         rollNo: null,
//       });
//     }
//     // First Floor: Students Rooms (201-218)
//     for (let num = 201; num <= 218; num++) {
//       roomsToInsert.push({
//         roomNumber: num,
//         hostelBlock: "Flora",
//         academicYear,
//         floor: 1,
//         rollNo: null,
//       });
//     }
//     // Second Floor: Students Rooms (301-318, 319-336)
//     for (let num = 301; num <= 318; num++) {
//       roomsToInsert.push({
//         roomNumber: num,
//         hostelBlock: "Flora",
//         academicYear,
//         floor: 2,
//         rollNo: null,
//       });
//     }
//     for (let num = 319; num <= 336; num++) {
//       roomsToInsert.push({
//         roomNumber: num,
//         hostelBlock: "Flora",
//         academicYear,
//         floor: 2,
//         rollNo: null,
//       });
//     }
//     // Third Floor: Students Rooms (401-418, 419-436)
//     for (let num = 401; num <= 418; num++) {
//       roomsToInsert.push({
//         roomNumber: num,
//         hostelBlock: "Flora",
//         academicYear,
//         floor: 3,
//         rollNo: null,
//       });
//     }
//     for (let num = 419; num <= 436; num++) {
//       roomsToInsert.push({
//         roomNumber: num,
//         hostelBlock: "Flora",
//         academicYear,
//         floor: 3,
//         rollNo: null,
//       });
//     }

//     // Tulip Hostel
//     // No student rooms as per your structure (all Guest/Research Scholar)

//     // Lavender Hostel (all rooms are student rooms)
//     // Ground Floor (101-118)
//     for (let num = 101; num <= 118; num++) {
//       roomsToInsert.push({
//         roomNumber: num,
//         hostelBlock: "Lavender",
//         academicYear,
//         floor: 0,
//         rollNo: null,
//       });
//     }
//     // First Floor (201-218)
//     for (let num = 201; num <= 218; num++) {
//       roomsToInsert.push({
//         roomNumber: num,
//         hostelBlock: "Lavender",
//         academicYear,
//         floor: 1,
//         rollNo: null,
//       });
//     }
//     // Second Floor (301-318)
//     for (let num = 301; num <= 318; num++) {
//       roomsToInsert.push({
//         roomNumber: num,
//         hostelBlock: "Lavender",
//         academicYear,
//         floor: 2,
//         rollNo: null,
//       });
//     }
//     // Third Floor (401-418)
//     for (let num = 401; num <= 418; num++) {
//       roomsToInsert.push({
//         roomNumber: num,
//         hostelBlock: "Lavender",
//         academicYear,
//         floor: 3,
//         rollNo: null,
//       });
//     }

//     // Show summary and confirm
//     console.log(`\nSummary:`);
//     console.log(`Total rooms to be created: ${roomsToInsert.length}`);

//     const blockSummary = roomsToInsert.reduce((acc, room) => {
//       acc[room.hostelBlock] = (acc[room.hostelBlock] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

//     Object.entries(blockSummary).forEach(([block, count]) => {
//       console.log(`  ${block}: ${count} rooms`);
//     });

//     const confirm = await prompt("\n❓ Do you want to proceed with inserting these rooms? (y/N): ");

//     if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
//       console.log("Operation cancelled.");
//       rl.close();
//       return;
//     }

//     // Insert rooms into database
//     console.log("\nInserting rooms into database...");

//     // Insert in batches to avoid potential issues with large datasets
//     const batchSize = 100;
//     for (let i = 0; i < roomsToInsert.length; i += batchSize) {
//       const batch = roomsToInsert.slice(i, i + batchSize);
//       await db.insert(roomModel).values(batch);
//       console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(roomsToInsert.length/batchSize)}`);
//     }

//     console.log(`\nSuccessfully inserted ${roomsToInsert.length} rooms!`);
//     console.log("Database setup complete.");

//     // Insert initial declaration
//     const initialDeclaration = {
//       type: "ADMISSION",
//       declarations: [
//         "Any student who commits ragging shall be punished with imprisonment for a term which may extend to two years and shall be liable to a fine which may extend to ten thousand rupees. Further, the convicted student shall be dismissed from the institution and shall not be admitted in any other institution.",
//         "1. Attendance: Attendance will be recorded at 09:00 pm (BOYS) and 8:30 pm (GIRLS) every day. Students should be available in the hostel before 8.00 pm and should assemble in the common rooms to enable the RC to take the attendance.\n2. Strict silence should be maintained in the hostel premises including rooms, bathrooms, dining halls, corridors, common areas, etc. Every student of the hostel should have the civic responsibility and should maintain cleanliness and should not cause inconvenience or disturbance to others and should maintain discipline and decorum.\n3. Hostellers are not permitted to change their rooms.\n4. The hostel rooms are subject to inspection by the University/ Hostel authorities to make sure that they are kept neat and tidy.\n5. \na) Prohibited items like liquor, drugs and narcotics, lethal weapons, cigarettes etc., are not allowed inside the rooms. Possession and use of these items will lead to expulsion from the hostel/ college and can lead to imprisonment.\nb) Consumption of alcohol, use of drugs and narcotics smoking and even possession of such things are prohibited.\nc) Inmates found intoxicated in the hostel premises due to consumption of alcohol outside the campus will be expelled from the hostels.\nd) Gambling in any form such as playing cards (Even without money at stake) is prohibited.\n6. \na) Day scholars and other hostel students are not allowed inside the hostel. Hostellers should not encourage their entry. If other students are found in the hostel, the inmates concerned will be penalized.\nb) Guests are not permitted inside any of the hostels.\nc) Members of the opposite sex are barred from entering the hostel room.\n7. \na) Celebrating birthday parties and other parties inside the hostel rooms is strictly prohibited.\nb) Collection of donations for any purpose (religious/ otherwise) is also strictly prohibited. Canvassing in any form to promote/ disgrace any religion/caste is strictly prohibited.\n8. Students absent from regular classes will have to get permission from the RC. Staying in the hostel during college hours when they have class work is not permitted except on health grounds.\n9. Hostellers coming to the hostel after the gate closing hours without prior permission or without valid reason would be fined. Frequent late comers will be ordered to vacate the hostel.\n10. Water and Electricity should be carefully used and not wasted.\n11. Wrong entry, improper/lack of entry in exit registers, signing on behalf of another person, tampering with the entries, proxy attendance and misguidance of any nature are punishable. In case of any quarrel between or among roommates, it should be reported to the RC immediately or can be brought to the notice of the Executive warden / The Warden directly for appropriate action.\n12. Students are not allowed to keep any power driven two-wheeler vehicles or cars in the hostel. Such students shall not be readmitted under any circumstances.\n13. The hostellers are not allowed to keep any electrical equipment like Iron box without written permission. Unauthorized possession will lead to confiscation of the goods.\n14. Use of Computers:\na) Installation of computer systems in the hostel rooms should be done only after getting written permission.\nb) The usage of computers should be for academic purposes only.\nc) The University/Hostel authorities will conduct surprise checks periodically and if anyone is found violating the above rule, disciplinary action will be taken against him/her.\n15. \na) Cell phones can be used by the students but not inside the classrooms /examination halls / laboratory / Library / offices and during silence hour in the hostel.\nb) The usage of cell phones is prohibited inside the dining hall/common room/ Hostel office.\n16. Students can visit the Hostel office only during visiting hours. (10.30 am to 05.30 pm)\n17. Students should read the circulars put up in the notice boards and be updated on the functioning of the hostel.\n18. Students are instructed to attend the General meetings of the hostel. It is mandatory that members of the student council and mess committee members should be hostellers.\n19. Students are not allowed to play skating rollers and other outdoor games (football /cricket, etc) inside the hostel building which can cause breakage / accidents. Sliding along the handrails / rest of stairs and fast running / climbing down should be totally avoided.\n20. When leaving the rooms for attending classes or for vacation, etc., electrical gadgets like lights, fan, geyser, AC should be switched off. Glass windows and Doors are to be closed securely.\n21. Violation of any of these rules would result in punitive action and serious violations would be referred to the higher authorities.\n22. Hostellers should not enter any unnecessary conversation, quarrel or altercation with the hostel staff. If anyone has any complaint against any employee of the hostel, a written complaint against the person is to be lodged with the RC. Use of abusive, vulgar, and unparliamentarily language against the hostel/mess staff is strictly forbidden. Strict action will be taken on any complaint of misbehavior by students from staff/faculty.\n23. If any hosteller is found indulging in any form of instigation/intimidation /threat to any other hosteller, he/she will be ordered to vacate the hostel.\n24. Rough handling of dining hall furniture, room furniture or any furniture fittings of the hostel is strictly forbidden. Inmates own Furniture’s like bed, cupboards, tables, chairs etc are prohibited inside the room. Vandalism is a very serious offence.\n25. The cost of damages will be recovered in the following manner:\na. If any individual or group is identified to have caused the damage, double the cost will be recovered from him/her/group.\nb. If damage is found in anyone of the rooms and the person(s) is/ are not identified, then double the cost will be recovered from the room- mates collectively.\nc. If damage is done outside the rooms i.e., in common places like corridors, bathrooms, recreation halls, mess etc., and the person(s) is/ are not identified, then double the cost will be recovered, floor wise or block wise or overall, as the case may be. Repetition of damage to the hostel property will result in expulsion from the hostel.\n26. Hostellers are strongly advised to lock valuables like laptops, watches, ornaments, money, etc; the hostel authorities are not responsible for any loss of property inside the room.\n27. Wastage of food in the mess is strictly prohibited and such actions will lead to additional mess charges to the inmate.\n28. All movements from and to the hostels should be recorded in the movement register kept with the security guard at the entrance of the hostel and should be properly signed.\n29. No hosteller is permitted to stay out of the hostel after 9.00 pm in the case of men’s hostel Sunday through Friday and 8.00 pm in the case of ladies’ hostel. The security guard has instructions to lock the gate after the stipulated timings as mentioned above. In case of any emergency, contact the Resident Counselor / The Executive Warden/ The Warden.\n30. Parents should not encourage students to go on picnics/tours outside Chennai. In such case, the parents should send an email / letter to the Executive warden.\nWeekend Leave:\na) In the case of an overnight stay at the Local Guardian’s House, parents should inform the RC regarding this in advance. Students should submit the filled-up LEAVE FORM along with the RC signature and submit to the Security prior to entry of details about their leaving.",
//         "DECLARATION / UNDERTAKING BY THE STUDENT FOR STAYING IN THE INTERNATIONAL HOSTEL\n\n1. I hereby declare that the entries made by me in the Application Form are complete and true to the best of my knowledge, belief and information.\n2. I hereby promise to abide by the rules and regulations concerning admission, attendance, discipline etc. of International Hostels, Anna University and follow the Code of Conduct prescribed for the Students of International Hostels, Anna University as in force from time to time and subsequent changes/ modifications/ amendment made thereto. I acknowledge that the Anna University has the authority for taking punitive actions against me for violation or non-compliance of the same.\n3. I hereby declare that I will neither join in any agitation / strike for the purpose of forcing the authorities of the Institute to resolve any problem, nor I will participate in any activity which has a tendency to disturb the peace and tranquility of academic environment of the Anna University campus and/or its Hostel premises.\n4. I hereby declare that I will not claim any fees except caution deposit of Rs.15,000/-\n5. I hereby declare that I will stay with the roommate allotted by the Hostel authorities under sharing system only, without any hesitation and without any disturbance."
//       ]
//     };

//     await db.insert(declarationModel).values(initialDeclaration);
//     console.log("Initial declaration inserted.");

//   } catch (error) {
//     console.error("Error during room structure setup:", error);
//   } finally {
//     rl.close();
//   }
// }

// // Run the script
// if (require.main === module) {
//   insertRoomStructure();
// }

// export { insertRoomStructure };