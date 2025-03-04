import { forwardRef, type ForwardedRef } from "react";

import clsx from "clsx";

import { type ComponentProps, type HTMLElementProps } from "~/components/types";
import { type BaseTypographyProps, getTypographyClassName } from "~/components/types/typography";

import { type InputSize, type InputVariant } from "./types";

type WrapperComponentName = "div" | "textarea";

type WrapperElement<C extends WrapperComponentName> = {
  div: HTMLDivElement;
  textarea: HTMLTextAreaElement;
}[C];

export type InputWrapperProps<C extends WrapperComponentName> = ComponentProps &
  HTMLElementProps<C> &
  Omit<BaseTypographyProps, "transform"> & {
    readonly component: C;
    readonly size?: InputSize;
    readonly variant?: InputVariant;
    readonly isActive?: boolean;
    readonly isDisabled?: boolean;
    readonly isLocked?: boolean;
    readonly isLoading?: boolean;
    readonly isReadOnly?: boolean;
    readonly dynamicHeight?: boolean;
  };

export const InputWrapper = forwardRef(
  <C extends WrapperComponentName>(
    {
      children,
      component,
      isDisabled = false,
      isActive = false,
      dynamicHeight = false,
      size = "medium",
      isLoading = false,
      isLocked = false,
      isReadOnly = false,
      variant = "primary",
      fontSize,
      fontWeight,
      fontFamily,
      ...props
    }: InputWrapperProps<C>,
    ref: ForwardedRef<WrapperElement<C>>,
  ) => {
    const ps = {
      ...props,
      ref,
      children,
      className: clsx(
        "input",
        `input--size-${size}`,
        `input--variant-${variant}`,
        {
          disabled: isDisabled,
          "input--dynamic-height": dynamicHeight,
          "input--locked": isLocked,
          "input--loading": isLoading,
          "input--active": isActive,
          "input--read-only": isReadOnly,
        },
        getTypographyClassName({ fontSize, fontWeight, fontFamily }),
        props.className,
      ),
    };
    switch (component) {
      case "div":
        return <div {...(ps as HTMLElementProps<"div">)} />;
      case "textarea":
        const className = clsx("text-area", ps.className);
        return (
          <textarea
            disabled={isDisabled}
            {...(ps as HTMLElementProps<"textarea">)}
            className={className}
          />
        );
    }
  },
) as {
  <C extends WrapperComponentName>(
    props: InputWrapperProps<C> & { readonly ref?: ForwardedRef<WrapperElement<C>> },
  ): JSX.Element;
};
