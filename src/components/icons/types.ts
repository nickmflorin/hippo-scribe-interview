import {
  type IconStyle as RootIconStyle,
  type IconFamily as RootIconFamily,
  type IconName,
} from "@fortawesome/fontawesome-svg-core";
import { z } from "zod";

import { type ComponentProps } from "~/components/types";
import { type Size } from "~/components/types/sizes";

export const IconDimensions = ["height", "width"] as const;
export type IconDimension = (typeof IconDimensions)[number];

export const IconFits = ["square", "fit"] as const;
export type IconFit = (typeof IconFits)[number];

export const IconDiscreteSizes = ["xxs", "xs", "sm", "md", "lg", "xl", "fill"] as const;
export type IconDiscreteSize = (typeof IconDiscreteSizes)[number];

export type IconSize = IconDiscreteSize | Size;

export type IconFamily = Exclude<RootIconFamily, "duotone">;

export enum IconFamilies {
  CLASSIC = "classic",
  SHARP = "sharp",
}

export const IconFamilyClassNameMap: { [key in IconFamily]: string } = {
  classic: "",
  sharp: "fa-sharp",
};

export const DEFAULT_ICON_FAMILY = IconFamilies.SHARP;

export type IconStyle = Exclude<RootIconStyle, "duotone" | "light" | "thin">;

export enum IconStyles {
  SOLID = "solid",
  REGULAR = "regular",
  BRANDS = "brands",
}

export const DEFAULT_ICON_STYLE = IconStyles.REGULAR;

export const IconStyleClassNameMap: { [key in IconStyle]: string } = {
  regular: "fa-regular",
  solid: "fa-solid",
  brands: "fa-brands",
};

/**
 * Defines the way that an "Icon" can be specified in the props for components in the application.
 */
export type IconProp = {
  readonly name: IconName;
  readonly family?: IconFamily;
  readonly iconStyle?: IconStyle;
};

export const IconPropSchema = z.object({
  name: z.string(),
  family: z.nativeEnum(IconFamilies).optional(),
  iconStyle: z.nativeEnum(IconStyles).optional(),
});

export const isIconProp = (value: unknown): value is IconProp =>
  IconPropSchema.safeParse(value).success;

type BaseIconProps = ComponentProps & {
  /**
   * Whether or not the Icon should be rendered as a "loading" spinner.  Useful in cases where a
   * component contains an Icon but needs to replace it with a loading indicator when in a loading
   * state.
   */
  readonly isLoading?: boolean;
  readonly loadingClassName?: ComponentProps["className"];
  /**
   * A string, "fit" or "square", that defines whether or not the `svg` element should fit snuggly
   * around the inner `path` element of the Icon or SVG ("fit") or the `svg` element should have
   * a 1-1 aspect ratio, with its inner `path` element being centered in the containing `svg`
   * ("square").
   *
   * Default: "square"
   */
  readonly fit?: IconFit;
  /**
   * The dimension {@link IconDimension} that the Icon should be sized in based on the provided
   * `size` prop. An Icon must maintain its aspect-ratio, so it cannot size in both directions.
   *
   * Default: "height";
   */
  readonly dimension?: IconDimension;
};

export type BasicIconProps = BaseIconProps & {
  [key in keyof IconProp]?: never;
} & {
  readonly icon: IconProp;
  readonly children?: never;
  readonly size?: IconSize;
};

export type EmbeddedIconProps = BaseIconProps &
  IconProp & {
    readonly size?: IconSize;
    readonly icon?: never;
    readonly children?: never;
  };

export type ChildrenIconProps = BaseIconProps & {
  [key in keyof IconProp]?: never;
} & {
  readonly size?: IconSize;
  readonly icon?: never;
  /* If the icon is an SVG, instead of a Font Awesome configured icon, it can be passed to the
     component as a child. */
  readonly children: JSX.Element;
};

export type SpinnerProps = Omit<
  BasicIconProps,
  "spin" | "icon" | "fit" | "isDisabled" | "visible" | "hidden" | "loadingClassName"
>;

export type IconProps = EmbeddedIconProps | ChildrenIconProps | BasicIconProps;

export type IconElement = React.ReactElement<IconProps>;

export type MultipleIconProp<T extends IconProp | IconElement = IconProp | IconElement> =
  | T
  | { left?: T; right: T };

export const parseMultipleIconProp = <T extends IconProp | IconElement>(
  prop: MultipleIconProp<T>,
  location: "left" | "right",
): T | null => {
  if (typeof prop === "object" && prop !== null && (prop as { right: T }).right !== undefined) {
    return location === "left" ? (prop as { left?: T }).left || null : (prop as { right: T }).right;
  } else if (location === "left") {
    return prop as T;
  }
  return null;
};

export const parseMultipleIconsProp = <T extends IconProp | IconElement>(
  prop: MultipleIconProp<T>,
): [T | null, T | null] => [
  parseMultipleIconProp(prop, "left"),
  parseMultipleIconProp(prop, "right"),
];
