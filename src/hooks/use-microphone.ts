import { useContext } from "react";

import { type MicrophoneManager } from "~/app/config/MicrophoneProvider";
import { MicrophoneContext } from "~/context/microphone-context";

export const useMicrophone = (): MicrophoneManager => {
  const context = useContext(MicrophoneContext);

  if (context === undefined) {
    throw new Error("useMicrophone must be used within a MicrophoneContextProvider");
  }

  return context;
};
