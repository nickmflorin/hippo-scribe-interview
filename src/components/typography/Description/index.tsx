"use client";
import { useMemo, type ReactNode } from "react";

import { isFragment } from "react-is";

import { type QuantitativeSize, sizeToString } from "~/components/types/sizes";

import { DescriptionNode, type DescriptionNodeProps } from "./DescriptionNode";

const descriptionNodeCanRender = (node: ReactNode) => {
  if (typeof node === "string") {
    return node.trim().length !== 0;
  }
  return (
    !isFragment(node) || typeof node !== "boolean" || (typeof node !== "undefined" && node !== null)
  );
};

const splitChildNodeString = (child: string, options: { lineBreakHeight?: QuantitativeSize }) => {
  if (child.includes("\n")) {
    const filtered = child.split("\n").filter(p => descriptionNodeCanRender(p));
    return filtered.flatMap((c, index) =>
      index !== filtered.length - 1
        ? [
            c.trim(),
            <span
              key={`break_${index}`}
              className="block"
              style={{ height: sizeToString(options.lineBreakHeight ?? 6, "px") }}
            />,
          ]
        : c.trim(),
    );
  }
  return [child];
};

export interface DescriptionProps extends DescriptionNodeProps {
  readonly lineBreakHeight?: QuantitativeSize;
}

export const Description = ({
  children,
  lineBreakHeight = 6,
  ...props
}: DescriptionProps): JSX.Element => {
  const nodes = useMemo(
    () =>
      (Array.isArray(children) ? children : [children]).reduce(
        (acc: ReactNode[], child): ReactNode[] => {
          if (Array.isArray(child)) {
            return [
              ...acc,
              ...child
                .filter(c => descriptionNodeCanRender(c))
                .reduce(
                  (acc: ReactNode[], c) => [
                    ...acc,
                    ...(typeof c === "string" ? splitChildNodeString(c, { lineBreakHeight }) : [c]),
                  ],
                  [],
                ),
            ];
          } else if (descriptionNodeCanRender(child)) {
            if (typeof child === "string") {
              return [...acc, ...splitChildNodeString(child, { lineBreakHeight })];
            }
            return [...acc, child];
          }
          return acc;
        },
        [] as ReactNode[],
      ),
    [children, lineBreakHeight],
  );

  if (nodes.length !== 0) {
    return <DescriptionNode {...props}>{nodes}</DescriptionNode>;
  }
  return <></>;
};
