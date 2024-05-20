import { type ReactNode } from "react";

import clsx from "clsx";

import { type ComponentProps } from "~/components/types";

import * as types from "../types";

export interface FormContentProps {
  readonly contentClassName?: ComponentProps["className"];
  readonly isLoading?: boolean;
  readonly isScrollable?: boolean;
  readonly children?: ReactNode;
}

export const FormContent = ({
  isLoading = false,
  isScrollable = true,
  contentClassName,
  children,
}: FormContentProps) => (
  <div
    className={clsx("flex flex-col grow relative", {
      "overflow-y-auto pr-[18px]": isScrollable,
    })}
  >
    {/* <Loading isLoading={isLoading}> */}
    <div className={clsx("flex flex-col gap-[8px]", contentClassName)}>{children}</div>
    {/* </Loading> */}
  </div>
);
