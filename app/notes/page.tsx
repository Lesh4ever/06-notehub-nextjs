import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function Notes() {
  const responce = await fetchNotes({ search: "", page: 1 });

  return <NotesClient initialData={responce} />;
}
