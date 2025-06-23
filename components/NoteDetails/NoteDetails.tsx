import { fetchNoteById } from "@/lib/api/api";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import NoteDetailsClient from "@/app/notes/NoteDetails.client";

interface Props {
  params: {
    id: string;
  };
}

export default async function NoteDetails({ params }: Props) {
  const queryClient = getQueryClient();
  const noteId = Number(params.id);

  await queryClient.prefetchQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
