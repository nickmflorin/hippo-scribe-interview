import { z } from "zod";

import { type EnvironmentName, EnvironmentNames } from "./constants";

export const STRICT_OMISSION = z.literal("").optional();

export const StringBooleanFlagSchema = z.union([
  z
    .custom<true>(val => typeof val === "string" && val.toLowerCase() === "true")
    .transform(() => true),
  z
    .custom<false>(val => typeof val === "string" && val.toLowerCase() === "false")
    .transform(() => false),
]);

export const environmentLookup = <T>(map: { [key in EnvironmentName]: T }): T => {
  if (process.env.VERCEL_ENV !== undefined) {
    if (!EnvironmentNames.includes(process.env.VERCEL_ENV as EnvironmentName)) {
      throw new Error(
        `The provided map does not have a key for VERCEL_ENV='${process.env.VERCEL_ENV}'!`,
      );
    }
    return map[process.env.VERCEL_ENV as EnvironmentName];
  } else if (process.env.NODE_ENV === "development") {
    return map.local;
  }
  return map[process.env.NODE_ENV];
};
