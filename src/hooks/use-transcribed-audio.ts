import { useCallback, useState, useEffect } from "react";

import { LiveTranscriptionEvents, type LiveTranscriptionEvent } from "@deepgram/sdk";

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
  const { connection, connect: connectToDeepgram, disconnect } = useDeepgram();
  const {
    record: startMicrophone,
    stop: stopMicrophone,
    pause: pauseMicrophone,
    error: microphoneError,
    microphone,
    state: recordingState,
  } = useMicrophone();
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);

  useEffect(() => {
    const onTranscript = async (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      const text = data.channel.alternatives[0].transcript;
      if (text.trim() !== "" && isFinal && speechFinal) {
        setTranscriptionError(null);
        const response = await transcribe(text);
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

    if (connection && microphone) {
      const microphoneListener = (e: BlobEvent) => {
        connection?.send(e.data);
      };

      connection.on(LiveTranscriptionEvents.Open, () => {
        connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
        microphone.addEventListener(MicrophoneEvents.DataAvailable, microphoneListener);

        microphone.onstop = () => {
          microphone.removeEventListener(MicrophoneEvents.DataAvailable, microphoneListener);
        };
      });
    }
    return () => {
      if (connection) {
        connection.removeAllListeners();
      }
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [connection, microphone]);

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
  };
};
