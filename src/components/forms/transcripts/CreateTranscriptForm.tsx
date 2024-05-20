"use client";
import { createTranscript } from "~/actions/mutations/create-transcript";
import { parseTranscriptAudio } from "~/actions/mutations/parse-transcript-audio";
import { type Transcript } from "~/actions/schemas";
import { RecordingButtons } from "~/components/buttons/RecordingButtons";
import { ButtonFooter } from "~/components/forms/ButtonFooter";
import { Title } from "~/components/typography/Title";
import { useTranscribedAudio } from "~/hooks/use-transcribed-audio";

import { useTranscriptForm } from "./hooks";
import { TranscriptForm } from "./TranscriptForm";

export const CreateTranscriptForm = () => {
  const form = useTranscriptForm();
  const { recordingState, isTranscribing, startRecording, stopRecording, pauseRecording } =
    useTranscribedAudio({
      transcribe: parseTranscriptAudio,
      onTranscribed: data => {
        if (data.firstName) {
          form.setValue("firstName", data.firstName);
        }
        if (data.lastName) {
          form.setValue("lastName", data.lastName);
        }
        if (data.transcript) {
          form.setValue("transcript", data.transcript);
        }
      },
      onTranscribedError: error => {
        /* Whether or not we would want to use the error directly here, or instead use a more
         "user-friendly" error, would be determined later. */
        form.setErrors(error);
      },
    });
  return (
    <TranscriptForm
      isLoading={isTranscribing}
      title={
        <div className="flex flex-row items-center justify-between">
          <Title order={4} className="leading-[24px]">
            Create a Transcript
          </Title>
          <RecordingButtons
            recordingState={recordingState}
            onStart={startRecording}
            onStop={stopRecording}
            onPause={pauseRecording}
          />
        </div>
      }
      form={form}
      footer={
        <ButtonFooter submitText="Create" cancelText="Cancel" onCancel={() => form.reset()} />
      }
      action={async data => {
        let response: Transcript;
        try {
          response = await createTranscript(data);
        } catch (e) {
          /* Here, we would want to have a standardized way of communicating errors between the
             server and the client.  The 'useForm' hook should be modified to expose a method,
             such as 'handleApiError', that would be responsible for intercepting the error and
             rendering the error(s) in the correct location in the form (whether they are relevant
             to specific fields, or global errors).  For now, we will just assume that the error
             is global. */
          form.setErrors(["There was an error creating the transcript."]);
          return;
        }
        if (response) {
          form.reset();
        }
      }}
    />
  );
};

export default CreateTranscriptForm;
