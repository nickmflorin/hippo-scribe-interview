import { type z } from "zod";

import { type TranscriptSchema } from "~/actions/schemas";
import { Form, type FormProps } from "~/components/forms/generic/Form";
import { TextArea } from "~/components/input/TextArea";
import { TextInput } from "~/components/input/TextInput";

type TranscriptFormValues = z.infer<typeof TranscriptSchema>;

export interface TranscriptFormProps
  extends Omit<FormProps<TranscriptFormValues>, "children" | "onSubmit"> {}

export const TranscriptForm = (props: TranscriptFormProps) => (
  <Form {...props}>
    <Form.Field
      name="firstName"
      label="First Name"
      form={props.form}
      helpText="The patient's first name."
    >
      <TextInput
        className="w-full"
        {...props.form.register("firstName")}
        placeholder="John"
        onClear={() => props.form.setValue("firstName", "")}
      />
    </Form.Field>
    <Form.Field
      name="lastName"
      label="Last Name"
      form={props.form}
      helpText="The patient's last name."
    >
      <TextInput
        className="w-full"
        {...props.form.register("lastName")}
        placeholder="Bon Jovi"
        onClear={() => props.form.setValue("lastName", "")}
      />
    </Form.Field>
    <Form.Field name="transcript" label="Transcript" form={props.form}>
      <TextArea
        className="w-full"
        {...props.form.register("transcript")}
        rows={4}
        placeholder="Today, the patient seemed to have pain in their lower back."
      />
    </Form.Field>
  </Form>
);
