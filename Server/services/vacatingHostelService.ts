import { db } from "../config/dbConnection";
import { vacatingHostelModel, NewVacatingHostel } from "../models/vacatingHostel";

export const createVacatingHostelForm = async (formData: NewVacatingHostel) => {
  return await db.insert(vacatingHostelModel).values(formData).returning();
};

export const getAllVacatingHostelForms = async () => {
  return await db.select().from(vacatingHostelModel);
};
