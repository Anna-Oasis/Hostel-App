import { db } from "../config/dbConnection";
import { eq,desc } from "drizzle-orm";
import { declarationModel, NewDeclaration } from "../models/declarationModel";
import { timestamp } from "drizzle-orm/gel-core";

export const postDeclaration = async (type:string,declarations: string[])=>
{
    await db.insert(declarationModel).values({type,declarations}).returning();
}

export const getLatestDeclaration = async (type:string)=>
{
    return await db.select()
    .from(declarationModel)
    .where(eq(declarationModel.type,type))
    .orderBy(desc(declarationModel.timestamp))
    .limit(1);
}