"use client";
import dynamic from "next/dynamic";
import React, { type ReactNode } from "react";

import { ScreenLoading } from "~/components/views/ScreenLoading";

const DeepgramProvider = dynamic(() => import("./DeepgramProvider"), {
  loading: () => <ScreenLoading />,
});

const MicrophoneProvider = dynamic(() => import("./MicrophoneProvider"), {
  loading: () => <ScreenLoading />,
});

export interface ClientConfigProps {
  readonly children: ReactNode;
  readonly deepgramApiKey: string;
}

function ClientConfig({ children, deepgramApiKey }: ClientConfigProps) {
  return (
    <DeepgramProvider apiKey={deepgramApiKey}>
      <MicrophoneProvider>{children}</MicrophoneProvider>
    </DeepgramProvider>
  );
}

export default ClientConfig;
