import {
  type FieldValues,
  type UseFormReturn,
  type Path,
  type PathValue,
  type UseFormProps,
} from "react-hook-form";
import { type z } from "zod";

export type BaseFormValues = FieldValues;

// We will likely need to expand this type.
export type FieldError = string;

export type FieldErrorAssertion = (v: unknown) => asserts v is FieldError;

export const assertFieldError: FieldErrorAssertion = (v: unknown) => {
  if (typeof v !== "string") {
    throw new TypeError(`The value ${JSON.stringify(v)} is not a valid field error!`);
  }
};

export const assertFieldErrorOrErrors: FieldErrorAssertion = (v: unknown) => {
  if (Array.isArray(v)) {
    v.map((vi: unknown) => assertFieldError(vi));
  } else if (typeof v !== "string") {
    throw new TypeError(`The value ${JSON.stringify(v)} is not a valid field error!`);
  }
};

export type FieldName<I extends BaseFormValues> = Path<I>;

export type FormValues<I extends BaseFormValues> = { [key in Path<I>]: PathValue<I, key> };
export type FieldValue<N extends FieldName<I>, I extends BaseFormValues> = PathValue<I, N>;

export type FieldErrors<I extends BaseFormValues> = { [key in FieldName<I>]?: string[] };

export type FormConfig<I extends BaseFormValues, IN = I> = Omit<UseFormProps<I>, "resolver"> & {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  readonly schema: z.ZodSchema<I, any, IN>;
};

export type ControlledFieldChangeHandler<N extends FieldName<I>, I extends BaseFormValues> = (
  value: FieldValue<N, I>,
) => void;

export type SetFormErrors<I extends BaseFormValues> = {
  (errors: string | string[]): void;
  (field: FieldName<I>, errors: string | string[]): void;
  (errors: FieldErrors<I>): void;
};

export type FormInstance<I extends BaseFormValues> = Omit<UseFormReturn<I>, "setError"> & {
  readonly errors: string[];
  readonly fieldErrors: FieldErrors<I>;
  readonly setValues: (values: FormValues<I>) => void;
  readonly clearErrors: () => void;
  readonly setErrors: SetFormErrors<I>;
};
