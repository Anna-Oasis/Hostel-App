import { z } from "zod";

export const cautionDepositSchema = z.object({
  accountHolderName: z.string(),
  accountNumber: z.string(),
  bankName: z.string(),
  addressOfTheBank: z.string(),
  IFSCode: z.string(),
});
