import { createContext } from "react";

import { type DeepgramManager } from "~/app/config/DeepgramProvider";

export const DeepgramContext = createContext<DeepgramManager | undefined>(undefined);
