import { rcModel } from "../models/rcModel";
import {studentModel} from "../models/studentModel";
import { userModel } from "../models/userModel";
import { eq } from "drizzle-orm";
import { db } from "../config/dbConnection";
import {hashPassword} from "../utils/hashPassword";
import { log } from "console";

export async function getRCidfromUserId(userId: number) {
  console.log("Fetching RC ID for user ID:", userId);
  const queryRes = await db
    .select()
    .from(rcModel)
    .where(eq(rcModel.userId
      , userId))
    .limit(1);
  log("Query Result:", queryRes);
  return queryRes[0].id;
}

export async function getRollNoFromUserId(userId:number){
  const queryRes = await db
    .select({rollNo: studentModel.rollNo})
    .from(studentModel)
    .where(eq(studentModel.user_id, userId))
    .limit(1);

  return queryRes[0].rollNo;
}

/**
 * 
 * @param hostel Name of the Hostel
 * @returns rcModel[]
 */
export async function getRCsbyHostel(hostel: string) {
  console.log("Fetching RC for hostel:", hostel);
  const queryRes = await db
    .select()
    .from(rcModel)
    .where(eq(rcModel.hostel, hostel))
  return queryRes;
}


export async function createUser(email:string ,name:string, password:string , role:string) {
  const hashedPassword = await hashPassword(password);
  const newUser = await db
    .insert(userModel)
    .values({
      email,
      name,
      password: hashedPassword,
      role
    })
    .returning();
  return newUser;
}

export async function deleteUser(userId: number) {
  const deletedUser = await db
    .delete(userModel)
    .where(eq(userModel.id, userId))
    .returning();
  return deletedUser;
}
