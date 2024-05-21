import { useCallback, useState, useEffect, useRef } from "react";

import {
  LiveConnectionState,
  LiveTranscriptionEvents,
  type LiveTranscriptionEvent,
} from "@deepgram/sdk";

import { RecordingState } from "~/lib/recording-state";
import { useDeepgram } from "~/hooks/use-deepgram";
import { useMicrophone } from "~/hooks/use-microphone";

export enum MicrophoneEvents {
  DataAvailable = "dataavailable",
  Error = "error",
  Pause = "pause",
  Resume = "resume",
  Start = "start",
  Stop = "stop",
}

interface UseTranscribedAudioConfig<D extends Record<string, unknown>> {
  readonly transcribe: (data: string) => Promise<{ data: D } | { error: string }>;
  readonly onTranscribed: (transcribed: D) => void;
  readonly onTranscribedError?: (error: string) => void;
  readonly onMicrophoneError?: (error: string) => void;
}

export const useTranscribedAudio = <D extends Record<string, unknown>>({
  transcribe,
  onTranscribed,
  onMicrophoneError,
  onTranscribedError,
}: UseTranscribedAudioConfig<D>) => {
  const transcribedText = useRef<string[]>([]);
  const {
    connection,
    state: connectionState,
    connect: connectToDeepgram,
    disconnect,
  } = useDeepgram();
  const {
    record: startMicrophone,
    stop: stopMicrophone,
    pause: pauseMicrophone,
    error: microphoneError,
    microphone,
    state: recordingState,
  } = useMicrophone();
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    if (
      connection &&
      microphone &&
      recordingState === RecordingState.OPEN &&
      connectionState === LiveConnectionState.OPEN
    ) {
      const onTranscript = async (data: LiveTranscriptionEvent) => {
        const text = data.channel.alternatives[0].transcript;
        if (text && text.trim() !== "") {
          transcribedText.current = [...transcribedText.current, text];
        }
      };

      const microphoneListener = (e: BlobEvent) => {
        connection.send(e.data);
      };
      microphone.addEventListener(MicrophoneEvents.DataAvailable, microphoneListener);
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);

      return () => {
        microphone.removeEventListener(MicrophoneEvents.DataAvailable, microphoneListener);
        connection.removeAllListeners();
      };
    }
  }, [connection, microphone, connectionState, recordingState]);

  useEffect(() => {
    if (microphone) {
      const microphoneStoppedListener = async () => {
        const text = transcribedText.current[transcribedText.current.length - 1];
        transcribedText.current = [];

        if (text && text.trim() !== "") {
          setTranscriptionError(null);
          setIsTranscribing(true);
          const response = await transcribe(text);
          setIsTranscribing(false);
          if ("error" in response) {
            /* Maintain the transcription error in state but also expose via a callback so the error
               can be managed both declaratively and reactively.  Declarative handling is important
               for usage in forms. */
            setTranscriptionError(response.error);
            return onTranscribedError?.(response.error);
          }
          return onTranscribed(response.data);
        }
      };
      microphone.addEventListener(MicrophoneEvents.Stop, microphoneStoppedListener);
      return () => {
        microphone.removeEventListener(MicrophoneEvents.Stop, microphoneStoppedListener);
      };
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [microphone]);

  const startRecording = useCallback(async () => {
    startMicrophone({ onError: onMicrophoneError });
    connectToDeepgram();
  }, [startMicrophone, connectToDeepgram, onMicrophoneError]);

  const stopRecording = useCallback(() => {
    stopMicrophone();
    disconnect();
  }, [stopMicrophone, disconnect]);

  return {
    transcriptionError,
    error: microphoneError || transcriptionError,
    startRecording,
    stopRecording,
    pauseRecording: pauseMicrophone,
    recordingState,
    isTranscribing,
  };
};
