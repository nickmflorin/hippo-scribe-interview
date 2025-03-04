import path from "path";
import { fileURLToPath } from "url";

import withBundleAnalyzer from "@next/bundle-analyzer";

/* Avoids the error: "ReferenceError: __dirname is not defined in ES module scope", which occurs if
   you refer to the __dirname global variable in an ES (ECMAScript) module.

  See: https://www.decodingweb.dev/dirname-is-not-defined-in-es-module-scope-fix */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import("next").NextConfig} */
const config = {
  swcMinify: true,
  output: "standalone",
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  experimental: {
    optimizePackageImports: ["zod"],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
  redirects: async () => [
    {
      source: "/",
      destination: "/new-transcript",
      permanent: false,
    },
  ],
};

const bundled = (phase, { defaultConfig }) =>
  withBundleAnalyzer({
    enabled: process.env.ANALYZE_BUNDLE === "true" && phase === "phase-production-build",
  })({
    ...defaultConfig,
    ...config,
  });

export default bundled;
