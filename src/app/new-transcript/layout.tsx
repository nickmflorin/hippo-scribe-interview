import type { ReactNode } from "react";

export default function NewTranscriptLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center p-[15px]">
      {children}
    </div>
  );
}
