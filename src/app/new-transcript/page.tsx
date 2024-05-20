import dynamic from "next/dynamic";

import { Loading } from "~/components/feedback/Loading";

const CreateTranscriptForm = dynamic(
  () => import("~/components/forms/transcripts/CreateTranscriptForm"),
  {
    loading: () => <Loading isLoading={true} />,
  },
);

export default function NewTranscriptPage() {
  return (
    <div className="flex flex-col max-w-[800px] min-w-[600px] mx-auto relative border p-[18px]">
      <CreateTranscriptForm />
    </div>
  );
}
