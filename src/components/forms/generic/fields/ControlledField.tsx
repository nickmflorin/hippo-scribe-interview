import { type JSX } from "react";

import { Controller, type ControllerRenderProps } from "react-hook-form";

import type { FormFieldProps } from "./Field";

import { type BaseFormValues, type FieldName } from "../types";

import { Field } from "./Field";

export type ControlledFieldProps<N extends FieldName<I>, I extends BaseFormValues> = Omit<
  FormFieldProps<N, I>,
  "children"
> & {
  readonly children: (params: ControllerRenderProps<I, N>) => JSX.Element;
};

export const ControlledField = <N extends FieldName<I>, I extends BaseFormValues>({
  children,
  ...props
}: ControlledFieldProps<N, I>): JSX.Element => (
  <Field<N, I> {...props}>
    <Controller
      control={props.form.control}
      name={props.name}
      render={({ field }) => children(field)}
    />
  </Field>
);
