"use client";
import { forwardRef, type ReactNode } from "react";

import { type Optional } from "utility-types";

import { capitalize } from "~/lib/formatters";
import { type IconProp, type IconElement } from "~/components/icons";
import { isIconProp } from "~/components/icons";
import { Icon } from "~/components/icons/Icon";
import Spinner from "~/components/icons/Spinner";
import { sizeToString, type Size } from "~/components/types/sizes";

import * as types from "../types";

import { AbstractButton } from "./AbstractButton";

export type IconButtonProps<F extends types.ButtonForm> = Optional<
  Omit<types.AbstractButtonProps<"icon-button", F>, "buttonType">,
  "children"
> & {
  readonly icon?: IconProp | IconElement;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const Base = AbstractButton as React.FC<types.AbstractButtonProps<"icon-button", any>>;

const WithLoading = ({
  children,
  isLoading,
}: {
  children: ReactNode;
  isLoading?: boolean;
}): JSX.Element => {
  if (isLoading) {
    return <Spinner isLoading />;
  }
  return <>{children}</>;
};

const LocalIconButton = forwardRef(
  <F extends types.ButtonForm>(
    { children, icon, ...props }: IconButtonProps<F>,
    ref: types.PolymorphicButtonRef<F>,
  ) => {
    const ps = { ...props, buttonType: "icon-button", ref } as types.AbstractButtonProps<
      "icon-button",
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      any
    > & {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      readonly ref?: types.PolymorphicButtonRef<any>;
    };
    return (
      <Base {...ps}>
        <div className="button__content">
          {children ? (
            <WithLoading isLoading={props.isLoading}>{children}</WithLoading>
          ) : isIconProp(icon) ? (
            <Icon
              icon={icon}
              isLoading={props.isLoading}
              fit="square"
              dimension="height"
              /* If the icon size corresponds to a discrete size, it will be set with a class name
                 by the abstract form of the button.  Otherwise, the size has to be provided
                 directly to the Icon component, in the case that it is non discrete (e.g. 32px, not
                 "small"). */
              size={
                props.iconSize !== undefined &&
                !types.ButtonDiscreteIconSizes.includes(
                  props.iconSize as types.ButtonDiscreteIconSize,
                )
                  ? sizeToString(props.iconSize as Size, "px")
                  : undefined
              }
            />
          ) : (
            <WithLoading isLoading={props.isLoading}>{icon}</WithLoading>
          )}
        </div>
      </Base>
    );
  },
) as {
  <F extends types.ButtonForm>(
    props: IconButtonProps<F> & { readonly ref?: types.PolymorphicButtonRef<F> },
  ): JSX.Element;
};

type VariantPartial = {
  <F extends types.ButtonForm>(
    props: Omit<IconButtonProps<F>, "variant"> & { readonly ref?: types.PolymorphicButtonRef<F> },
  ): JSX.Element;
};

type WithVariants = { [key in Capitalize<types.ButtonVariant<"icon-button">>]: VariantPartial };

const withVariants = [...types.ButtonVariants["icon-button"]].reduce<WithVariants>(
  (acc, variant) => ({
    ...acc,
    [capitalize(variant)]: forwardRef(
      <F extends types.ButtonForm>(
        props: Omit<IconButtonProps<F>, "variant">,
        ref: types.PolymorphicButtonRef<F>,
      ) => <LocalIconButton<F> {...({ ...props, variant } as IconButtonProps<F>)} ref={ref} />,
    ),
  }),
  {} as WithVariants,
);

export const IconButton = Object.assign(LocalIconButton, withVariants);
