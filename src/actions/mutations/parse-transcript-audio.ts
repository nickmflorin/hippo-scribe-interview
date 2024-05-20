"use server";
import OpenAI from "openai";

import { logger } from "~/application/logger";
import { environment } from "~/environment";

const openai = new OpenAI({
  apiKey: environment.get("OPEN_AI_API_KEY"),
});

export type ParsedTranscript = {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly transcript?: string;
};

export const parseTranscriptAudio = async (
  data: string,
): Promise<{ data: ParsedTranscript } | { error: string }> => {
  let parsed: OpenAI.Chat.Completions.ChatCompletion;

  try {
    parsed = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You will be provided with unstructured text.  Return as a JSON object, the first " +
            "name of the client, under key 'firstName', the last name of the client, under key " +
            "'lastName', and the rest of the text, under key 'transcript'.",
        },
        {
          role: "user",
          content: data,
        },
      ],
      temperature: 0.7,
      max_tokens: 64,
      top_p: 1,
    });
  } catch (e) {
    logger.error(`There was an error parsing the audio:\n${e}`);
    return { error: "There was an error parsing the recorded audio." };
  }
  if (parsed.choices[0].message.content) {
    return { data: JSON.parse(parsed.choices[0].message.content) };
  }
  return { data: {} };
};
