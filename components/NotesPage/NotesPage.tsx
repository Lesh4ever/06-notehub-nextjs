"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";
import { fetchNotes } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import NoteForm from "@/components/NoteForm/NoteForm";
import { Note } from "@/types/note";
import NoteModal from "../NoteModal/NoteModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";

type NotesPageProps = {
  notes: Note[];
  totalPages: number;
};

export default function NotesPage({ notes, totalPages }: NotesPageProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const queryClient = useQueryClient();

  const { data, isPending, isError, isSuccess } = useQuery({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () =>
      fetchNotes({
        search: debouncedSearch,
        page,
      }),
    initialData: {
      notes,
      totalPages,
    },
  });

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success("Note deleted!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch notes");
    }
  }, [isError]);

  return (
    <div className="container">
      <SearchBox value={search} onSearch={handleSearch} />
      <button onClick={handleOpenModal}>Add Note</button>

      {isPending && <p>Loading...</p>}

      {isSuccess && data.notes.length > 0 && (
        <>
          <NoteList notes={data.notes} onDelete={(id: number) => mutate(id)} />
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {isSuccess && data.notes.length === 0 && (
        <p>No notes found for your search</p>
      )}

      {isModalOpen && (
        <NoteModal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </NoteModal>
      )}
    </div>
  );
}
