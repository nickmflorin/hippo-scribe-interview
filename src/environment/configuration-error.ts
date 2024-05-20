import type * as types from "./types";

export class ConfigurationError<
  R extends types.RuntimeEnv<V>,
  V extends types.Validators<R>,
> extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}
