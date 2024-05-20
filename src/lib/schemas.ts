import { z } from "zod";

type ErrorMessage<V extends string | null = string> =
  | string
  | ((params: { min: number; value: V }) => string);

interface NonNullableStringFieldOptions {
  readonly requiredErrorMessage?: string;
  readonly min?: number;
  readonly minErrorMessage?: ErrorMessage<string>;
}

export const NonNullableStringField = ({
  min,
  minErrorMessage = ({ min }) => `The field must be at least ${min ?? 3} characters.`,
  requiredErrorMessage = "The field is required.",
}: NonNullableStringFieldOptions) =>
  z.string().transform((v, ctx) => {
    let value: string | null = v;
    if (typeof v === "string" && v.trim().length === 0) {
      value = null;
    }
    if (min !== undefined && value !== null && value.length < min) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: min,
        type: "string",
        inclusive: true,
        message:
          typeof minErrorMessage === "function" ? minErrorMessage({ value, min }) : minErrorMessage,
      });
      return z.NEVER;
    } else if (value === null) {
      if (min !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: min,
          type: "string",
          inclusive: true,
          message: requiredErrorMessage,
        });
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: requiredErrorMessage,
        });
      }
      return z.NEVER;
    }
    return value;
  });
