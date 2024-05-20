import { useContext } from "react";

import { type DeepgramManager } from "~/app/config/DeepgramProvider";
import { DeepgramContext } from "~/context/deepgram-context";

export const useDeepgram = (): DeepgramManager => {
  const context = useContext(DeepgramContext);
  if (context === undefined) {
    throw new Error(
      "The 'useDeepgram' hook must be used within the scope of DeepgramContextProvider!",
    );
  }
  return context;
};
