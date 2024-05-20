import clsx from "clsx";
import pick from "lodash.pick";

import { UnreachableCaseError } from "~/application/errors";
import { sizeToString, type Size } from "~/components/types/sizes";
import { type BaseTypographyProps, getTypographyClassName } from "~/components/types/typography";

import * as types from "./types";

type ButtonClassNamePropName =
  | "variant"
  | "isLocked"
  | "isActive"
  | "isLoading"
  | "isDisabled"
  | "className"
  | "size"
  | "iconSize"
  | "fontWeight"
  | "fontSize"
  | "fontFamily"
  | "transform"
  | "buttonType"
  | "lockedClassName"
  | "disabledClassName"
  | "loadingClassName"
  | "activeClassName";

export type ButtonClassNameProps<T extends types.ButtonType, F extends types.ButtonForm> = Pick<
  types.AbstractButtonProps<T, F>,
  ButtonClassNamePropName
>;

const buttonSizeClassName = <T extends types.ButtonType, F extends types.ButtonForm>({
  size = "small",
  buttonType,
}: Pick<types.AbstractButtonProps<T, F>, "size" | "buttonType">): string | null => {
  switch (buttonType) {
    case "icon-button":
      if (types.ButtonDiscreteSizes.includes(size as types.ButtonDiscreteSize)) {
        return `button--size-${size}`;
      }
      /* Here, because the size does not correspond to a discrete sizing option, the sizing will be
         applied with inline styles based on the button size prop - not in SASS. */
      return null;
    case "link":
      /* The link does not have an associated 'size' prop - its size is only determined by the
         font size of the text it contains. */
      return null;
    case "button":
      if (!types.ButtonDiscreteSizes.includes(size as types.ButtonDiscreteSize)) {
        throw new Error("A button can only be sized based on a discrete set of sizes.");
      }
      return `button--size-${size}`;
    default:
      throw new UnreachableCaseError();
  }
};

export const getButtonClassName = <T extends types.ButtonType, F extends types.ButtonForm>(
  props: ButtonClassNameProps<T, F>,
) =>
  clsx(
    "button",
    `button--variant-${props.variant ?? "primary"}`,
    `button--type-${props.buttonType}`,
    // The size may be provided as a size string (e.g. 32px).
    buttonSizeClassName<T, F>(props),
    props.buttonType === "button" && props.fontSize ? `font-size-${props.fontSize}` : null,
    /* The icon size may be provided as a size string (e.g. 32px) - so we do not want to size the
       icon with a class name if the size is not discrete. */
    props.iconSize &&
      types.ButtonDiscreteIconSizes.includes(props.iconSize as types.ButtonDiscreteIconSize)
      ? `button--icon-size-${props.iconSize}`
      : "",
    {
      [clsx("button--locked", props.lockedClassName)]: props.isLocked,
      [clsx("button--loading", props.loadingClassName)]: props.isLoading,
      [clsx("button--disabled", props.disabledClassName)]: props.isDisabled,
      [clsx("button--active", props.activeClassName)]: props.isActive,
    },
    props.buttonType !== "icon-button"
      ? getTypographyClassName({
          ...pick(props, ["fontFamily", "fontWeight", "transform"] as const),
          fontSize:
            props.buttonType === "link"
              ? (props.fontSize as BaseTypographyProps["fontSize"] | undefined)
              : undefined,
        } as BaseTypographyProps)
      : "",
    {
      [clsx(props.lockedClassName)]: props.isLocked,
      [clsx(props.loadingClassName)]: props.isLoading,
      [clsx(props.disabledClassName)]: props.isDisabled,
      [clsx(props.activeClassName)]: props.isActive,
    },
    props.className,
  );

type ButtonStylePropName = "style" | "size";

export type ButtonStyleProps<T extends types.ButtonType, F extends types.ButtonForm> = Pick<
  types.AbstractButtonProps<T, F>,
  ButtonStylePropName
>;

export const getButtonStyle = <T extends types.ButtonType, F extends types.ButtonForm>(
  props: ButtonStyleProps<T, F>,
) =>
  /* Note: A potentially non-discrete icon size string provided as a prop must be handled by each
     individual button component that extends the AbstractButton.  This is because the icon size
     must be provided directly to the Icon component being rendered. */
  !types.ButtonDiscreteIconSizes.includes(props.size as types.ButtonDiscreteIconSize) &&
  props.size !== undefined
    ? { ...props.style, height: sizeToString(props.size as Size, "px") }
    : props.style;

export type ButtonClassNameStyleProps<
  T extends types.ButtonType,
  F extends types.ButtonForm,
> = Pick<types.AbstractButtonProps<T, F>, ButtonStylePropName | ButtonClassNamePropName>;
