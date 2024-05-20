import clsx from "clsx";

export const TextFontSizes = ["xxxs", "xxs", "xs", "sm", "smplus", "md", "lg", "xl"] as const;
export type TextFontSize = (typeof TextFontSizes)[number];

export const LabelFontSizes = TextFontSizes;
export type LabelFontSize = TextFontSize;

export const DescriptionFontSizes = TextFontSizes;
export type DescriptionFontSize = TextFontSize;

export const TitleFontSizes = TextFontSizes;
export type TitleFontSize = TextFontSize;

export const FontWeights = ["light", "regular", "medium", "semibold", "bold"] as const;
export type FontWeight = (typeof FontWeights)[number];

export type TitleOrder = 1 | 2 | 3 | 4 | 5 | 6;

export const TitleFontSizeOrderMap: { [key in TitleFontSize]: TitleOrder } = {
  xxxs: 6,
  xxs: 6,
  xs: 5,
  sm: 4,
  smplus: 4,
  md: 3,
  lg: 2,
  xl: 1,
};

export const TextTransforms = ["uppercase", "lowercase", "capitalize", "underline"] as const;
export type TextTransform = (typeof TextTransforms)[number];

export const FontFamilies = ["inter"] as const;
export type FontFamily = (typeof FontFamilies)[number];

export type LineClamp = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const lineClampClassName = (clamp: LineClamp = 0) => {
  if (clamp === 0) {
    return "";
  }
  return clsx("break-words", {
    "line-clamp-1": clamp === 1,
    "line-clamp-2": clamp === 2,
    "line-clamp-3": clamp === 3,
    "line-clamp-4": clamp === 4,
    "line-clamp-5": clamp === 5,
    "line-clamp-6": clamp === 6,
  });
};

export interface BaseTypographyProps<
  F extends TextFontSize | TitleFontSize | LabelFontSize | DescriptionFontSize = TextFontSize,
> {
  readonly fontSize?: F;
  readonly fontWeight?: FontWeight;
  readonly fontFamily?: FontFamily;
  readonly transform?: TextTransform;
  readonly lineClamp?: LineClamp;
  readonly truncate?: boolean;
}

export const getTypographyClassName = (props: BaseTypographyProps): string =>
  clsx(
    props.fontSize && `font-size-${props.fontSize}`,
    props.fontFamily && `font-family-${props.fontFamily}`,
    props.transform && `text-transform-${props.transform}`,
    props.fontWeight && `font-weight-${props.fontWeight}`,
    props.lineClamp !== undefined ? lineClampClassName(props.lineClamp) : "",
    { truncate: props.truncate },
  );
