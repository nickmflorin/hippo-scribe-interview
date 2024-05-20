import dynamic from "next/dynamic";
import { forwardRef } from "react";

import clsx from "clsx";

import { Spinner } from "~/components/icons/Spinner";
import { type ComponentProps, type HTMLElementProps } from "~/components/types";

import { InputWrapper, type InputWrapperProps } from "./InputWrapper";

const ClearButton = dynamic(() => import("~/components/buttons/ClearButton"), {});

export interface InputProps
  extends Omit<InputWrapperProps<"div">, "component" | "onChange">,
    ComponentProps,
    Pick<
      HTMLElementProps<"div">,
      | "onFocus"
      | "onBlur"
      | "onPointerDown"
      | "onMouseDown"
      | "onClick"
      | "onKeyDown"
      | "onKeyUp"
      | "onFocusCapture"
    > {
  readonly reserveSpaceForLoadingIndicator?: boolean;
  readonly clearDisabled?: boolean;
  readonly onClear?: () => void;
}

export const Input = forwardRef<HTMLDivElement, InputProps>(
  (
    {
      children,
      clearDisabled = false,
      reserveSpaceForLoadingIndicator = true,
      onClear,
      ...props
    }: InputProps,
    ref,
  ) => (
    <InputWrapper {...props} ref={ref} component="div">
      <div className="input__content">{children}</div>
      <div className="flex flex-row gap-[4px] items-center">
        <div
          className={clsx("w-[14px] items-center justify-center", {
            "w-[14px]": reserveSpaceForLoadingIndicator,
          })}
        >
          <Spinner isLoading={props.isLoading} size="14px" className="text-gray-500" />
        </div>
        {onClear && (
          <ClearButton
            key="1"
            isDisabled={clearDisabled}
            onClick={e => {
              e.stopPropagation();
              onClear();
            }}
          />
        )}
      </div>
    </InputWrapper>
  ),
);
