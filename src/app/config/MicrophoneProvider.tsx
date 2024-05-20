"use client";
import { useCallback, useState, type ReactNode } from "react";

import { RecordingState } from "~/lib/recording-state";
import { logger } from "~/application/logger";
import { MicrophoneContext } from "~/context/microphone-context";

interface MicrophoneProviderProps {
  children: ReactNode;
}

export interface MicrophoneManager {
  readonly state: RecordingState;
  readonly error: string | null;
  readonly microphone: MediaRecorder | null;
  readonly record: (config?: MicrophoneConfig) => void;
  readonly stop: () => void;
  readonly pause: () => void;
  readonly configure: (config?: MicrophoneConfig) => Promise<MediaRecorder | null>;
}

export type MicrophoneConfig = {
  readonly noiseSuppression?: boolean;
  readonly echoCancellation?: boolean;
  readonly onError?: (error: string) => void;
};

export const MicrophoneProvider = ({ children }: MicrophoneProviderProps) => {
  /* const [state, setState] = useState<MicrophoneState>(MicrophoneState.NotSetup);
     const [microphone, setMicrophone] = useState<MediaRecorder | null>(null); */
  const [microphone, setMicrophone] = useState<MediaRecorder | null>(null);
  const [state, setState] = useState<RecordingState>(RecordingState.NOT_READY);
  const [error, setError] = useState<string | null>(null);

  const configure = useCallback(async (config?: MicrophoneConfig) => {
    setState(RecordingState.CONFIGURING);
    let media: MediaStream;
    try {
      media = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: config?.noiseSuppression ?? true,
          echoCancellation: config?.echoCancellation ?? true,
        },
      });
    } catch (err) {
      logger.error(`There was an error setting up the browser microphone:\n${err}`);
      /* Maintain the microphone error in state but also expose via a callback so the error
         can be managed both declaratively and reactively.  Declarative handling is important
         for usage in forms. */
      setError("There was an error setting up the browser microphone.");
      config?.onError?.("There was an error setting up the browser microphone.");
      setState(RecordingState.ERROR);
      return null;
    } finally {
      setState(RecordingState.READY);
    }
    return new MediaRecorder(media);
  }, []);

  const stop = useCallback(() => {
    microphone?.stop();
    setMicrophone(null);
    setState(RecordingState.NOT_READY);
  }, [microphone]);

  const pause = useCallback(() => {
    if (!microphone) {
      logger.warn("Cannot pause recording when there is no microphone instance in state.");
    } else if (state !== RecordingState.OPEN) {
      logger.warn(`Cannot pause microphone when state is '${microphone.state}'.`);
    } else {
      setState(RecordingState.PAUSING);
      microphone.pause();
      setState(RecordingState.PAUSED);
    }
  }, [microphone, state]);

  const record = useCallback(
    async (config?: MicrophoneConfig) => {
      if ([RecordingState.READY, RecordingState.PAUSED, RecordingState.NOT_READY].includes(state)) {
        let mic: MediaRecorder | null;
        if (!microphone || state === RecordingState.NOT_READY) {
          logger.info("Creating new microphone instance.");
          mic = await configure(config);
        } else {
          mic = microphone;
        }
        if (mic) {
          setState(RecordingState.OPENING);
          if (state === RecordingState.PAUSED) {
            mic.resume();
          } else {
            logger.info("Starting microphone recording after it was in an inactive state.");
            mic.start(250);
          }
          setMicrophone(mic);
          setState(RecordingState.OPEN);
        }
      }
    },
    [microphone, state, configure],
  );

  return (
    <MicrophoneContext.Provider
      value={{
        error,
        state,
        microphone,
        stop,
        configure,
        record,
        pause,
      }}
    >
      {children}
    </MicrophoneContext.Provider>
  );
};

export default MicrophoneProvider;
