/* eslint-disable import/order */
import { type ReactNode } from "react";

import "~/styles/globals/index.scss"; // Import this last.

import ClientConfig from "./ClientConfig";
import { environment } from "~/environment";

export interface AppConfigProps {
  readonly children: ReactNode;
}

export const AppConfig = ({ children }: AppConfigProps): JSX.Element => (
  <ClientConfig deepgramApiKey={environment.get("DEEPGRAM_API_KEY")}>{children}</ClientConfig>
);
