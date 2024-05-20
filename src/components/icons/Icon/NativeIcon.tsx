"use client";
import { useState, useEffect } from "react";

import clsx from "clsx";

import { type IconProps } from "../types";

import { getNativeIconStyle, type DynamicIconClassNamePropName } from "./util";

export const NativeIcon = (
  props: { children?: JSX.Element } & Pick<
    IconProps,
    "style" | "className" | DynamicIconClassNamePropName
  >,
) => {
  const [content, setContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    setContent(
      <i className={clsx(props.className)} style={{ ...props.style, ...getNativeIconStyle(props) }}>
        {props.children}
      </i>,
    );
  }, [props]);

  return <>{content}</>;
};
