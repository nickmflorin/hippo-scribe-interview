/**
 * Represents the state of the browser's built-in microphone.
 */
export enum RecordingState {
  NOT_READY = "not_ready",
  STOPPED = "stopped",
  CONFIGURING = "configuring",
  READY = "ready",
  OPENING = "opening",
  OPEN = "open",
  PAUSING = "pausing",
  PAUSED = "paused",
  ERROR = "error",
}

export const isRecordingState = (state: string): state is RecordingState =>
  Object.values(RecordingState).includes(state as RecordingState);

type RecordingStateAssertion = (state: string) => asserts state is RecordingState;

export const assertIsRecordingState: RecordingStateAssertion = state => {
  if (!isRecordingState(state)) {
    throw new Error(`Invalid recording state: ${state}`);
  }
};

export const toSafeRecordingState = (state: string): RecordingState => {
  assertIsRecordingState(state);
  return state;
};
