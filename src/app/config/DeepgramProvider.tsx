"use client";

import { useState, type ReactNode } from "react";

import {
  createClient,
  type LiveClient,
  LiveConnectionState,
  LiveTranscriptionEvents,
  type LiveSchema,
} from "@deepgram/sdk";

import { DeepgramContext } from "~/context/deepgram-context";

const DefaultDeepgramLiveSchema: LiveSchema = {
  model: "nova-2",
  interim_results: true,
  smart_format: true,
  filler_words: true,
  utterance_end_ms: 3000,
};

type DeepgramConnectOptions = Partial<LiveSchema> & {
  readonly endpoint?: string;
};

interface DeepgramProviderProps {
  readonly children: ReactNode;
  /* The API key must be provided from the root server layout, since it must access environment
     variables that are not available in the client. */
  readonly apiKey: string;
}

/**
 * Represents the managed state of the Deepgram connection.
 */
export interface DeepgramManager {
  readonly connection: LiveClient | null;
  readonly state: LiveConnectionState;
  readonly connect: (options?: DeepgramConnectOptions) => LiveClient;
  readonly disconnect: () => void;
}

export const DeepgramProvider = ({ children, apiKey }: DeepgramProviderProps) => {
  const [connection, setConnection] = useState<LiveClient | null>(null);
  const [state, setState] = useState<LiveConnectionState>(LiveConnectionState.CLOSED);

  const connect = (options?: DeepgramConnectOptions) => {
    const { endpoint, ...rest } = options || {};
    const client = createClient(apiKey);

    const conn = client.listen.live({ ...DefaultDeepgramLiveSchema, ...rest }, endpoint);

    conn.addListener(LiveTranscriptionEvents.Open, () => {
      setState(LiveConnectionState.OPEN);
    });

    conn.addListener(LiveTranscriptionEvents.Close, () => {
      setState(LiveConnectionState.CLOSED);
    });

    setConnection(conn);
    return conn;
  };

  const disconnect = async () => {
    if (connection) {
      connection.finish();
      setConnection(null);
    }
  };

  return (
    <DeepgramContext.Provider
      value={{
        connection,
        connect,
        disconnect,
        state,
      }}
    >
      {children}
    </DeepgramContext.Provider>
  );
};

export default DeepgramProvider;
