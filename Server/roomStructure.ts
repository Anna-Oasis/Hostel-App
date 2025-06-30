import { hostelBlock } from "./constants/enum";
import { roomModel } from "./models/roomModel";
import * as readline from 'readline';

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { logger } from './utils/logger';

config({ path: '.env' }); 

let db: ReturnType<typeof drizzle>;

export async function initDb() {
  const client = postgres(process.env.DATABASE_URL!);
  try {
    await client`SELECT 1`;
    logger.config('✅ Database connected successfully');
    db = drizzle(client);
  } catch (err) {
    logger.error(`Database connection failed: ${err}`);
    process.exit(1);
  }
}

export { db };

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt user input
function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Helper function to validate academic year format (e.g., "2024-2025")
function isValidAcademicYear(year: string): boolean {
  const regex = /^\d{4}-\d{4}$/;
  return regex.test(year);
}

async function insertRoomStructure() {
  try {
    // Initialize database connection first
    await initDb();
    
    console.log("🏠 Hostel Room Structure Setup");
    console.log("===============================\n");

    // Get academic year
    let academicYear: string;
    do {
      academicYear = await prompt("Enter academic year (format: YYYY-YYYY, e.g., 2024-2025): ");
      if (!isValidAcademicYear(academicYear)) {
        console.log("❌ Invalid format! Please use YYYY-YYYY format.");
      }
    } while (!isValidAcademicYear(academicYear));

    console.log(`\n📅 Academic Year: ${academicYear}`);
    console.log(`\n🏢 Available Hostel Blocks: ${Object.values(hostelBlock).join(', ')}\n`);

    const roomsToInsert: Array<{
      roomNumber: number;
      hostelBlock: string;
      academicYear: string;
      floor: number;
      rollNo: string[] | null;
    }> = [];

    // Process each hostel block
    for (const block of Object.values(hostelBlock)) {
      console.log(`\n🏢 Setting up ${block} Block:`);
      console.log("─".repeat(30));

      // Get number of floors for this block
      const floorsInput = await prompt(`How many floors does ${block} block have? `);
      const numFloors = parseInt(floorsInput);

      if (isNaN(numFloors) || numFloors <= 0) {
        console.log(`❌ Invalid number of floors for ${block}. Skipping this block.`);
        continue;
      }

      // Get rooms per floor for this block
      const roomsPerFloorInput = await prompt(`How many rooms per floor in ${block} block? `);
      const roomsPerFloor = parseInt(roomsPerFloorInput);

      if (isNaN(roomsPerFloor) || roomsPerFloor <= 0) {
        console.log(`❌ Invalid number of rooms per floor for ${block}. Skipping this block.`);
        continue;
      }

      // Generate room structure for this block
      let roomCounter = 1;
      
      for (let floor = 0; floor < numFloors; floor++) {
        console.log(`  📍 Floor ${floor}: Rooms ${roomCounter} to ${roomCounter + roomsPerFloor - 1}`);
        
        for (let roomInFloor = 1; roomInFloor <= roomsPerFloor; roomInFloor++) {
          roomsToInsert.push({
            roomNumber: roomCounter,
            hostelBlock: block,
            academicYear: academicYear,
            floor: floor,
            rollNo: null // Initially empty, will be filled when students are assigned
          });
          roomCounter++;
        }
      }

      console.log(`  ✅ ${block} Block: ${numFloors} floors, ${roomsPerFloor * numFloors} total rooms`);
    }

    // Show summary and confirm
    console.log(`\n📊 Summary:`);
    console.log(`Total rooms to be created: ${roomsToInsert.length}`);
    
    const blockSummary = roomsToInsert.reduce((acc, room) => {
      acc[room.hostelBlock] = (acc[room.hostelBlock] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(blockSummary).forEach(([block, count]) => {
      console.log(`  ${block}: ${count} rooms`);
    });

    const confirm = await prompt("\n❓ Do you want to proceed with inserting these rooms? (y/N): ");
    
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log("❌ Operation cancelled.");
      rl.close();
      return;
    }

    // Insert rooms into database
    console.log("\n🔄 Inserting rooms into database...");
    
    // Insert in batches to avoid potential issues with large datasets
    const batchSize = 100;
    for (let i = 0; i < roomsToInsert.length; i += batchSize) {
      const batch = roomsToInsert.slice(i, i + batchSize);
      await db.insert(roomModel).values(batch);
      console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(roomsToInsert.length/batchSize)}`);
    }

    console.log(`\n🎉 Successfully inserted ${roomsToInsert.length} rooms!`);
    console.log("Database setup complete.");

  } catch (error) {
    console.error("❌ Error during room structure setup:", error);
  } finally {
    rl.close();
  }
}

// Run the script
if (require.main === module) {
  insertRoomStructure();
}

export { insertRoomStructure };