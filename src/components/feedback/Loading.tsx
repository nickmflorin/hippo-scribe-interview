import React, { type ReactNode } from "react";

import { LoadingView, type LoadingViewProps } from "~/components/views/LoadingView";

export interface LoadingProps extends LoadingViewProps {
  readonly children?: ReactNode;
}

export const Loading = ({ isLoading = false, children, ...props }: LoadingProps): JSX.Element => {
  if (children) {
    return (
      <>
        {isLoading === true && <LoadingView {...props} isLoading={isLoading} />}
        {children}
      </>
    );
  } else if (isLoading === true) {
    <LoadingView {...props} isLoading={isLoading} />;
  }
  return <></>;
};
