import nextJest from "next/jest.js";

import type { Config } from "jest";

// Jest configuration options that are allowed to be overridden on a per-project basis.
type AllowedConfig = Omit<
  Config,
  | "rootDir"
  | "prettierPath"
  | "globalSetup"
  | "preset"
  | "transform"
  | "moduleDirectories"
  | "moduleFileExtensions"
>;

const createNextJestConfig = nextJest({
  /*
  Provide the path to your Next.js app to load next.config.js and .env files in your test
  environment
  */
  dir: "./",
});

export enum TestModule {
  prettier = "prettier",
  eslint = "eslint",
}

const TestModuleDisplayNames: { [key in TestModule]: string } = {
  [TestModule.eslint]: "eslint-tests",
  [TestModule.prettier]: "prettier-tests",
};

export const withBaseConfig = (rootDir: string, config: AllowedConfig): Config => ({
  ...config,
  rootDir,
});

/**
 * Returns an async function that establishes the overall Jest configuration for the application.
 *
 * This function should not be used for establishing the configuration of individual
 * {@link TestModule}(s) in the application, but rather all of the {@link TestModule}(s) as a
 * whole.
 *
 * @see withModuleConfig
 *
 * @param {string} rootDir
 *   The root directory of the application.
 *
 * @param {DynamicConfig} config
 *   Optional, additional Jest configuration options.
 */
export const withApplicationConfig = (rootDir: string, projects: string[]) =>
  createNextJestConfig(
    withBaseConfig(rootDir, {
      projects,
    }),
  );

export type ModuleConfig = Omit<AllowedConfig, "displayName"> & {
  readonly module: TestModule;
};

/**
 * Returns an async function that Jest will use to establish the configuration for a given
 * {@link TestModule} in the application.
 *
 * @param {string} rootDir
 *   The root directory which contains the `jest.config.ts` file for the specific
 *   {@link TestModule}.  This should be provided as the __dirname variable inside of the project's
 *   `jest.config.ts`.
 *
 * @param {ModuleConfig} config
 *   Optional, additional Jest configuration options for the specific module.
 */
export const withModuleConfig = (rootDir: string, { module, ...config }: ModuleConfig) => {
  const resulting = createNextJestConfig(
    withBaseConfig(rootDir, {
      ...config,
      displayName: TestModuleDisplayNames[module],
    }),
  );
  return resulting;
};
