import clsx from "clsx";

import type * as types from "../types";

import { type ComponentProps } from "~/components/types";

import { FormErrors } from "./FormErrors";

export interface FormFooterProps<I extends types.BaseFormValues> {
  readonly form: types.FormInstance<I>;
  readonly footer?: JSX.Element;
  readonly footerClassName?: ComponentProps["className"];
  readonly isScrollable?: boolean;
}

export const FormFooter = <I extends types.BaseFormValues>({
  footer,
  footerClassName,
  isScrollable = true,
  form,
}: FormFooterProps<I>) => (
  <>
    {(form.errors.length !== 0 || footer) && (
      <div
        className={clsx("flex flex-col mt-[16px]", { "pr-[18px]": isScrollable }, footerClassName)}
      >
        <FormErrors form={form} className="my-[4px]" />
        {footer}
      </div>
    )}
  </>
);
