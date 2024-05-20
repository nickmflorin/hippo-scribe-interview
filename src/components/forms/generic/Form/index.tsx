import clsx from "clsx";
import { type SubmitErrorHandler } from "react-hook-form";

import { type ComponentProps } from "~/components/types";

import { Field, ControlledField } from "../fields";
import { type FormInstance, type BaseFormValues } from "../types";

import { FormContent, type FormContentProps } from "./FormContent";
import { FormFooter, type FormFooterProps } from "./FormFooter";
import { FormHeader, type FormHeaderProps } from "./FormHeader";
import { NativeForm, type NativeFormProps } from "./NativeForm";

type SubmitAction<I extends BaseFormValues> = (data: I, form: FormInstance<I>) => void;

export interface FormProps<I extends BaseFormValues>
  extends FormContentProps,
    FormFooterProps<I>,
    FormHeaderProps,
    Omit<
      NativeFormProps,
      keyof ComponentProps | "action" | "onSubmit" | "submitButtonType" | "children"
    > {
  readonly onSubmit?: SubmitAction<I>;
  readonly action?: SubmitAction<I>;
  readonly onError?: SubmitErrorHandler<I>;
}

export const Form = <I extends BaseFormValues>({
  form,
  children,
  title,
  isLoading = false,
  isScrollable = true,
  contentClassName,
  footer,
  footerClassName,
  action,
  onSubmit,
  onError,
  ...props
}: FormProps<I>): JSX.Element => {
  if (onSubmit && action) {
    throw new Error("Both the action and submit handler cannot be simultaneously provided.");
  }
  return (
    <NativeForm
      {...props}
      className={clsx("flex flex-col w-full relative overflow-hidden", props.className)}
      action={
        action !== undefined
          ? () => {
              form.handleSubmit((data: I) => {
                action(data, form);
              }, onError)();
            }
          : undefined
      }
      onSubmit={
        onSubmit !== undefined
          ? form.handleSubmit(data => {
              onSubmit(data, form);
            }, onError)
          : undefined
      }
    >
      <FormHeader title={title} />
      <FormContent
        isLoading={isLoading}
        isScrollable={isScrollable}
        contentClassName={contentClassName}
      >
        {children}
      </FormContent>
      <FormFooter
        footer={footer}
        footerClassName={footerClassName}
        isScrollable={isScrollable}
        form={form}
      />
    </NativeForm>
  );
};

Form.Field = Field;
Form.ControlledField = ControlledField;

export default Form;
