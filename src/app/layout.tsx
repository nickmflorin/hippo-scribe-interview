import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { type ReactNode } from "react";

import { AppConfig } from "~/app/config/AppConfig";
import { environment } from "~/environment";

const InterFont = Inter({
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hippo Scribe",
  description: "Automating your transcript flows.",
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

if (!process.env.FONT_AWESOME_KIT_TOKEN) {
  throw new Error("The FONT_AWESOME_KIT_TOKEN environment variable must be set!");
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="48x48" />
        <Script
          type="text/javascript"
          src={`https://kit.fontawesome.com/${environment.get("FONT_AWESOME_KIT_TOKEN")}.js`}
          /* Using "nest" instead of "replace" avoids errors related to
             NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is
             not a child of this node */
          data-auto-replace-svg="nest"
          strategy="beforeInteractive"
        />
      </head>
      <body className={InterFont.className}>
        <AppConfig>
          <div className="w-[100vw] h-[100vh] overflow-hidden">{children}</div>
        </AppConfig>
      </body>
    </html>
  );
}
