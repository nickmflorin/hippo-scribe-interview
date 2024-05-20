import { type JSX, type ReactNode } from "react";

import clsx from "clsx";

import { type ComponentProps } from "~/components/types";
import { Description } from "~/components/typography/Description";
import { Label, type LabelProps } from "~/components/typography/Label";
import { Text } from "~/components/typography/Text";

import { type FormInstance, type BaseFormValues, type FieldError, type FieldName } from "../types";

import { FormFieldErrors } from "./FieldErrors";

interface BaseFieldProps extends ComponentProps {
  readonly children: JSX.Element | JSX.Element[];
  readonly label?: ReactNode;
  readonly automaticallyRenderErrors?: boolean;
  readonly description?: string;
  readonly helpText?: string;
  readonly helpTextClassName?: ComponentProps["className"];
  readonly labelProps?: Omit<LabelProps, "children" | keyof ComponentProps>;
  readonly labelClassName?: ComponentProps["className"];
}

export interface FormFieldProps<N extends FieldName<I>, I extends BaseFormValues>
  extends BaseFieldProps {
  readonly form: FormInstance<I>;
  readonly name: N;
  readonly errors?: never;
}

export interface GenericFieldProps extends BaseFieldProps {
  readonly errors?: FieldError[];
  readonly form?: never;
  readonly name?: never;
}

export type FieldProps<N extends FieldName<I>, I extends BaseFormValues> =
  | GenericFieldProps
  | FormFieldProps<N, I>;

export const Field = <N extends FieldName<I>, I extends BaseFormValues>({
  children,
  name,
  label,
  form,
  errors: _errors = [],
  automaticallyRenderErrors = true,
  labelClassName,
  labelProps,
  description,
  helpText,
  helpTextClassName,
  ...props
}: FieldProps<N, I>): JSX.Element => (
  <div {...props} className={clsx("flex flex-col w-full", props.className)}>
    {label !== undefined && (
      <div className="w-full mb-[4px] flex h-[20px]">
        <Label fontSize="sm" fontWeight="medium" {...labelProps} className={labelClassName}>
          {label}
        </Label>
      </div>
    )}
    {description !== undefined && (
      <Description fontSize="xs" className="leading-[16px] mb-[6px]">
        {description}
      </Description>
    )}
    <div className="form-field-content">{children}</div>
    {helpText !== undefined && (
      <Text
        fontSize="xs"
        className={clsx("leading-[14px] text-gray-500 pl-[1px] mt-[4px]", helpTextClassName)}
      >
        {helpText}
      </Text>
    )}
    {automaticallyRenderErrors ? (
      form ? (
        <FormFieldErrors form={form} name={name} />
      ) : (
        <FormFieldErrors errors={_errors} />
      )
    ) : (
      <></>
    )}
  </div>
);
