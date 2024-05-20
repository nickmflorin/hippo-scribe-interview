import { createContext } from "react";

import { type MicrophoneManager } from "~/app/config/MicrophoneProvider";

export const MicrophoneContext = createContext<MicrophoneManager | undefined>(undefined);
