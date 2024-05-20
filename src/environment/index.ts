import { z } from "zod";

import { DEFAULT_PRETTY_LOGGING, LogLevels, DEFAULT_LOG_LEVELS } from "./constants";
import { Environment } from "./Environment";
import { environmentLookup, STRICT_OMISSION, StringBooleanFlagSchema } from "./util";

export * from "./constants";

type MoreThan2Array<V> = [V, V, ...V[]];

export const environment = Environment.create(
  {
    runtime: {
      /* ---------------------------- Server Environment Variables ---------------------------- */
      ANALYZE_BUNDLE: process.env.ANALYZE_BUNDLE,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      LOGFLARE_API_KEY: process.env.LOGFLARE_API_KEY,
      LOGFLARE_SOURCE_TOKEN: process.env.LOGFLARE_SOURCE_TOKEN,
      DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
      OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
      FONT_AWESOME_KIT_TOKEN: process.env.FONT_AWESOME_KIT_TOKEN,
      /* ---------------------------- Client Environment Variables ---------------------------- */
      NEXT_PUBLIC_PRETTY_LOGGING: process.env.NEXT_PUBLIC_PRETTY_LOGGING,
      NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    },
    validators: {
      DEEPGRAM_API_KEY: z.string(),
      OPEN_AI_API_KEY: z.string(),
      NEXT_PUBLIC_PRETTY_LOGGING: StringBooleanFlagSchema.default(
        environmentLookup(DEFAULT_PRETTY_LOGGING),
      ),
      NEXT_PUBLIC_LOG_LEVEL: z
        .union(
          LogLevels.map(v => z.literal(v)) as MoreThan2Array<
            z.ZodLiteral<(typeof LogLevels)[number]>
          >,
        )
        .default(environmentLookup(DEFAULT_LOG_LEVELS)),
      NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: z.string().optional(),
      NODE_ENV: z.enum(["development", "test", "production"]),
      VERCEL_ENV: z.enum(["development", "production", "preview"]),
      ANALYZE_BUNDLE: StringBooleanFlagSchema.optional(),
      FONT_AWESOME_KIT_TOKEN: z.string(),
      LOGFLARE_SOURCE_TOKEN: environmentLookup<
        z.ZodString | z.ZodOptional<z.ZodLiteral<"">> | z.ZodOptional<z.ZodString>
      >({
        test: STRICT_OMISSION,
        development: z.string(),
        local: z.string().optional(),
        preview: z.string(),
        production: z.string(),
      }),
      LOGFLARE_API_KEY: environmentLookup<
        z.ZodString | z.ZodOptional<z.ZodLiteral<"">> | z.ZodOptional<z.ZodString>
      >({
        test: STRICT_OMISSION,
        development: z.string(),
        local: z.string().optional(),
        preview: z.string(),
        production: z.string(),
      }),
    },
  },
  {},
);
