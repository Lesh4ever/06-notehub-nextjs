import { fetchNotes } from "@/lib/api";
import NotesPage from "@/components/NotesPage/NotesPage";

export default async function Notes() {
  const { notes, totalPages } = await fetchNotes({ search: "", page: 1 });

  return <NotesPage notes={notes} totalPages={totalPages} />;
}
