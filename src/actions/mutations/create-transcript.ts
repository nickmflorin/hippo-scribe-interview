"use server";
import { type z } from "zod";

import { type TranscriptSchema } from "~/actions/schemas";

export const createTranscript = async (req: z.infer<typeof TranscriptSchema>) =>
  /* Here, we would want to get the user from the request and ensure that they have the correct
     access and permissions to create a transcript. */

  /* const createdTranscript = await db.transcripts.create({...});
     return createdTranscript; */

  req;
