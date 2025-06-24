import { fetchNoteById } from "@/lib/api/api";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import NoteDetailsClient from "../NoteDetails.client";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function NotePage({ params }: PageProps) {
  const queryClient = getQueryClient();
  const id = Number(params.id);

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
