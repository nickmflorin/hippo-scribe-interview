import clsx from "clsx";

import { type ComponentProps } from "~/components/types";

type Position = "relative" | "absolute";
type Fill = "screen" | "parent";

export type AbstractViewProps = ComponentProps & {
  readonly children?: React.ReactNode;
  readonly position?: Position;
  readonly fill?: Fill | null;
  readonly centerChildren?: boolean;
};

export const AbstractView = ({
  children,
  position = "absolute",
  centerChildren = true,
  fill = "parent",
  style,
  className,
}: AbstractViewProps) => (
  <div
    style={style}
    className={clsx(
      position,
      {
        "h-[100vh] w-[100vw]": fill === "screen",
        "h-full w-full": fill === "parent",
        "flex flex-col items-center justify-center": centerChildren,
        "left-0 top-0": fill !== null && position === "absolute",
      },
      className,
    )}
  >
    {children}
  </div>
);
