export const EnvironmentNames = ["test", "local", "development", "production", "preview"] as const;
export type EnvironmentName = (typeof EnvironmentNames)[number];

export const LogLevels = ["fatal", "error", "info", "warn", "debug", "trace", "silent"] as const;
export type LogLevel = (typeof LogLevels)[number];

export const DEFAULT_LOG_LEVELS: { [key in EnvironmentName]: LogLevel } = {
  development: "info",
  production: "info",
  test: "debug",
  local: "debug",
  preview: "info",
};

export const DEFAULT_PRETTY_LOGGING: Record<EnvironmentName, boolean> = {
  development: false,
  production: false,
  preview: false,
  test: true,
  local: true,
};
