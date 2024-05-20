import { forwardRef } from "react";

import clsx from "clsx";

import { RecordingState } from "~/lib/recording-state";
import type { IconButtonVariant } from "~/components/buttons/types";
import { Icon } from "~/components/icons/Icon";

import { IconButton, type IconButtonProps } from "./generic";

const RecordingStateVariantMap: { [key in RecordingState]: IconButtonVariant } = {
  [RecordingState.NOT_READY]: "primary",
  [RecordingState.CONFIGURING]: "primary",
  [RecordingState.READY]: "primary",
  [RecordingState.OPENING]: "primary",
  [RecordingState.OPEN]: "primary",
  [RecordingState.STOPPED]: "primary",
  [RecordingState.PAUSING]: "primary",
  [RecordingState.PAUSED]: "primary",
  [RecordingState.ERROR]: "danger",
};

export interface RecordingButtonsProps
  extends Omit<
    IconButtonProps<"button">,
    "icon" | "options" | "iconSize" | "size" | "variant" | "onClick"
  > {
  readonly recordingState: RecordingState;
  readonly onPause?: () => void;
  readonly onStop?: () => void;
  readonly onStart?: () => void;
}

export const RecordingButtons = forwardRef<HTMLButtonElement, RecordingButtonsProps>(
  (
    { recordingState, style, className, onPause, onStop, onStart, ...props }: RecordingButtonsProps,
    ref,
  ): JSX.Element => (
    <div style={style} className={clsx("flex flex-row items-center gap-[8px]", className)}>
      <IconButton
        {...props}
        variant={RecordingStateVariantMap[recordingState]}
        ref={ref}
        as="button"
        size="small"
        isDisabled={recordingState === RecordingState.ERROR}
        isLoading={[
          RecordingState.CONFIGURING,
          RecordingState.OPENING,
          RecordingState.PAUSING,
        ].includes(recordingState)}
        onClick={() => {
          if (recordingState === RecordingState.OPEN) {
            onPause?.();
          } else {
            onStart?.();
          }
        }}
      >
        {/* Each icon must be rendered in the DOM regardless of whether or not it should be used
            based on the recording state.  This is because of how FontAwesome's script works with
            NextJS.  The icon class name (fa-*) cannot change after the <i> element is initially
            rendered. */}
        <>
          <Icon
            name="microphone"
            iconStyle="solid"
            style={
              [RecordingState.PAUSED, RecordingState.OPEN].includes(recordingState)
                ? { display: "none" }
                : {}
            }
          />
          <Icon
            name="play"
            iconStyle="solid"
            style={[RecordingState.PAUSED].includes(recordingState) ? {} : { display: "none" }}
          />
          <Icon
            name="pause"
            iconStyle="solid"
            style={[RecordingState.OPEN].includes(recordingState) ? {} : { display: "none" }}
          />
        </>
      </IconButton>
      {recordingState === RecordingState.OPEN && (
        <IconButton
          {...props}
          variant={RecordingStateVariantMap[recordingState]}
          ref={ref}
          as="button"
          size="small"
          icon={{ name: "stop", iconStyle: "solid" }}
          onClick={() => onStop?.()}
        />
      )}
    </div>
  ),
);
