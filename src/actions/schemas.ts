import { z } from "zod";

import { NonNullableStringField } from "~/lib/schemas";

export const TranscriptSchema = z.object({
  firstName: NonNullableStringField({
    min: 2,
    minErrorMessage: "The patient's first name must be at least 2 characters.",
    requiredErrorMessage: "The patient's first name is required.",
  }),
  lastName: NonNullableStringField({
    min: 2,
    minErrorMessage: "The patient's last name must be at least 2 characters.",
    requiredErrorMessage: "The patient's last name is required.",
  }),
  transcript: NonNullableStringField({
    min: 5,
    minErrorMessage: "The transcript must be at least 5 characters.",
    requiredErrorMessage: "The transcript is required.",
  }),
});

export type Transcript = z.infer<typeof TranscriptSchema>;
