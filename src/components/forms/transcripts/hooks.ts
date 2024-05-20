import { TranscriptSchema } from "~/actions/schemas";
import { useForm } from "~/components/forms/generic/hooks";

export const useTranscriptForm = () =>
  useForm({
    schema: TranscriptSchema,
    defaultValues: {
      firstName: "",
      lastName: "",
      transcript: "",
    },
  });
