"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { deleteNote, fetchNotes } from "@/lib/api";
import toast from "react-hot-toast";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import NoteModal from "@/components/NoteModal/NoteModal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./Notes.module.css";
import { Note } from "@/types/note";

type NotesClientProps = {
  notes: Note[];
  totalPages: number;
};

export default function NotesClient({ notes, totalPages }: NotesClientProps) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success("Note deleted");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isPending, error } = useQuery({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () => fetchNotes({ search: debouncedSearch, page }),
    initialData: {
      notes,
      totalPages,
    },
    placeholderData: (prev) => prev,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (isPending) return <p>Loading, please wait...</p>;
  if (error) return <p>Could not fetch the list of notes. {error.message}</p>;
  if (!data || data.notes.length === 0) return <p>No notes found.</p>;

  return (
    <div className={css.wrapper}>
      <SearchBox value={search} onSearch={handleSearch} />
      <button onClick={handleOpenModal}>Add Note</button>

      {data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={(id: number) => mutate(id)} />
      )}

      {data.totalPages > 1 && (
        <Pagination
          totalPages={data.totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      )}

      {isModalOpen && (
        <NoteModal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </NoteModal>
      )}
    </div>
  );
}
