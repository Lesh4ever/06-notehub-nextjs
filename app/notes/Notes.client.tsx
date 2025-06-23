"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api/api";
import toast from "react-hot-toast";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import css from "./Notes.module.css";

export default function NotesClient() {
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

  const { data, isPending, error } = useQuery({
    queryKey: ["notes", { search, page }],
    queryFn: () => fetchNotes({ search, page }),
    placeholderData: (prev) => prev,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  if (isPending) return <p>Loading, please wait...</p>;
  if (error) return <p>Could not fetch the list of notes. {error.message}</p>;
  if (!data || data.notes.length === 0) return <p>No notes found.</p>;

  return (
    <div className={css.wrapper}>
      <SearchBox value={search} onSearch={handleSearch} />
      <NoteList notes={data.notes} onDelete={mutate} />
      <Pagination
        totalPages={data.totalPages}
        currentPage={page}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
