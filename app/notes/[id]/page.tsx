import { fetchNoteById } from "@/lib/api";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import NoteDetailsClient from "./NoteDetails.client";

type NotePageProps = {
  params: Promise<{ id: string }>;
};

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();
  const numericId = Number(id);

  await queryClient.prefetchQuery({
    queryKey: ["note", numericId],
    queryFn: () => fetchNoteById(numericId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={numericId} />
    </HydrationBoundary>
  );
}
