import clsx from "clsx";

import type { ComponentProps } from "~/components/types";
import { Title } from "~/components/typography/Title";

export interface FormHeaderProps extends ComponentProps {
  readonly title?: string | JSX.Element | JSX.Element[];
}

export const FormHeader = ({ title, ...props }: FormHeaderProps) => (
  <>
    {typeof title === "string" ? (
      <Title {...props} order={4} className={clsx("mb-4", props.className)}>
        {title}
      </Title>
    ) : title ? (
      <div {...props} className={clsx("flex flex-col mb-4", props.className)}>
        {title}
      </div>
    ) : null}
  </>
);
