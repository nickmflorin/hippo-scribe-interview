import React from "react";

import clsx from "clsx";

import { type SpinnerProps } from "~/components/icons";
import { Spinner } from "~/components/icons/Spinner";
import { type ComponentProps } from "~/components/types";

import { AbstractView, type AbstractViewProps } from "./AbstractView";

export interface LoadingViewProps extends Pick<AbstractViewProps, "fill" | keyof ComponentProps> {
  readonly spinner?: boolean;
  readonly isLoading?: boolean;
  readonly spinnerSize?: Exclude<SpinnerProps["size"], "full">;
}

export const LoadingView = ({
  spinnerSize = "24px",
  spinner = true,
  isLoading,
  fill = "parent",
  ...props
}: LoadingViewProps) => (
  <AbstractView
    {...props}
    fill={fill}
    position="absolute"
    centerChildren
    className={clsx(
      "loading",
      {
        /* If the spinner is being displayed, the view needs to have a higher z-index than it other
           wise would.  This is such that the spinner appears over the content.  This will prevent
           scroll behavior on the content, but only when the spinner is present. */
        "z-50": isLoading && spinner,
        "z-20": isLoading && !spinner,
      },
      { "is-loading": isLoading },
      props.className,
    )}
  >
    {spinner && isLoading ? <Spinner size={spinnerSize} isLoading={true} /> : <></>}
  </AbstractView>
);
