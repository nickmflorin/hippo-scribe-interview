export const InputSizes = ["small", "medium", "large"] as const;
export type InputSize = (typeof InputSizes)[number];

export const InputVariants = ["primary", "bare"] as const;
export type InputVariant = (typeof InputVariants)[number];
