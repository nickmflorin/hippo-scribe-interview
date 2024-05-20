import { useCallback, useMemo, useState, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import omit from "lodash.omit";
import {
  useForm as useReactHookForm,
  type Path,
  type PathValue,
  type FieldErrors as NativeFieldErrors,
  type SubmitHandler,
  type SubmitErrorHandler,
} from "react-hook-form";

import { humanizeList } from "~/lib/formatters";
import { logger } from "~/application/logger";

import {
  type FormInstance,
  type BaseFormValues,
  type FieldName,
  type FormConfig,
  type FieldErrors,
  type SetFormErrors,
} from "../types";

/* TODO: We may have to revisit this.  When determining the string error message from a react hook
   form field error, the message attribute may either be a string, undefined, or another error
   object with a nested message attribute (which can recursively be either a string, undefined,
   or another error object).  The recursions are mostly due to the capability of react hook form
   to deal with nested fields - which we don't have to currently worry about, but may in the future.
   For now, we will just assume the mesage property at the top level is a string, and if it is not,
   we will return a default error message.
   Note: In the future, we may also want to investigate converting the error object's 'type' field
   into a string error message, because that will always be defined as a string, for each level of
   the recursion. */
const getReactHookFormErrorMessage = <I extends BaseFormValues>(
  errs: NativeFieldErrors[FieldName<I>],
) => (typeof errs?.message === "string" ? errs.message : "The field is invalid.");

function mergeIntoFieldErrors<I extends BaseFormValues>(
  a: FieldErrors<I>,
  b: FieldErrors<I> | NativeFieldErrors,
): FieldErrors<I>;

function mergeIntoFieldErrors<I extends BaseFormValues>(
  errors: FieldErrors<I>,
  key: FieldName<I>,
  err: string | string[],
): FieldErrors<I>;

function mergeIntoFieldErrors<I extends BaseFormValues>(
  arg0: FieldErrors<I>,
  arg1: FieldName<I> | FieldErrors<I> | NativeFieldErrors,
  arg2?: string | string[],
): FieldErrors<I> {
  if (arg2) {
    if (typeof arg1 !== "string") {
      throw new TypeError("Invalid method implementation.");
    }
    return {
      ...arg0,
      [arg1]: (Array.isArray(arg2) ? arg2 : [arg2]).reduce((prev: string[], curr: string) => {
        if (prev.includes(curr)) {
          /* This should never happen, but has happened in cases where static field errors were set
             on the form after a failed API request made with a hook. */
          logger.warn(`The form received a duplicate error message for field '${arg1}': ${curr}.`);
          return prev;
        }
        return [...prev, curr];
      }, arg0[arg1] ?? []),
    };
  } else if (typeof arg1 === "string") {
    throw new TypeError("Invalid method implementation.");
  }
  return Object.keys(arg1).reduce((prev, key) => {
    const errs = arg1[key as FieldName<I>];
    if (errs !== undefined) {
      return mergeIntoFieldErrors(
        prev,
        key as FieldName<I>,
        // See docstring above the 'getReactHookFormErrorMessage' function.
        Array.isArray(errs) ? errs : getReactHookFormErrorMessage(errs),
      );
    }
    return prev;
  }, arg0);
}

export const useForm = <I extends BaseFormValues, IN = I>({
  schema,
  ...options
}: FormConfig<I, IN>): FormInstance<I> => {
  const [internalFieldErrors, _setInternalFieldErrors] = useState<FieldErrors<I>>({});
  const [globalErrors, setGlobalErrors] = useState<string[]>([]);
  const registeredFields = useRef<FieldName<I>[]>([]);

  const {
    setValue,
    getValues,
    handleSubmit: _handleSubmit,
    clearErrors: clearNativeErrors,
    formState,
    ...form
  } = useReactHookForm<I>({
    ...options,
    resolver: zodResolver(schema),
  });

  const setValues = useMemo(
    () => (values: { [key in Path<I>]: PathValue<I, key> }) => {
      for (const key in values) {
        const k = key as Path<I>;
        if (Object.prototype.hasOwnProperty.call(values, k)) {
          setValue(k, values[k]);
        }
      }
    },
    [setValue],
  );

  const setInternalFieldErrors = useCallback((fieldErrors: FieldErrors<I>) => {
    const invalidFields = Object.keys(fieldErrors).reduce((prev: string[], curr: string) => {
      if (!registeredFields.current.includes(curr as FieldName<I>)) {
        return [...prev, curr];
      }
      return prev;
    }, [] as string[]);
    if (invalidFields.length !== 0) {
      const humanized = humanizeList(registeredFields.current, {
        conjunction: "and",
        formatter: v => `'${v}'`,
      });
      logger.warn(
        "The form received field errors for fields that are not registered with the form! " +
          `Current fields registered with the form are: ${humanized}.`,
        { invalidFields, registered: registeredFields.current },
      );
    }
    return _setInternalFieldErrors(fieldErrors);
  }, []);

  const clearErrors = useCallback(() => {
    setGlobalErrors([]);
    setInternalFieldErrors({});
    clearNativeErrors();
  }, [clearNativeErrors, setInternalFieldErrors]);

  const setErrors: SetFormErrors<I> = useCallback(
    (arg0: FieldName<I> | FieldErrors<I> | string | string[], arg1?: string | string[]) => {
      if (arg1) {
        if (typeof arg0 !== "string") {
          throw new TypeError("Invalid method implementation!");
        }
        return setInternalFieldErrors({
          [arg0 as FieldName<I>]: Array.isArray(arg1) ? arg1 : [arg1],
        } as FieldErrors<I>);
      } else if (typeof arg0 === "string" || Array.isArray(arg0)) {
        return setGlobalErrors(Array.isArray(arg0) ? arg0 : [arg0]);
      } else {
        setInternalFieldErrors(arg0);
      }
    },
    [setInternalFieldErrors],
  );

  const fieldErrors = useMemo(
    () => mergeIntoFieldErrors(internalFieldErrors, formState.errors),
    [formState.errors, internalFieldErrors],
  );

  const handleSubmit = useCallback(
    (fn: SubmitHandler<I>, onError?: SubmitErrorHandler<I> | undefined) =>
      _handleSubmit((data: I) => {
        clearErrors();
        return fn(data);
      }, onError),
    [clearErrors, _handleSubmit],
  );

  return {
    formState,
    errors: globalErrors,
    fieldErrors,
    handleSubmit,
    setValue,
    setValues,
    getValues,
    clearErrors,
    setErrors,
    ...omit(form, ["setError"]),
  };
};
