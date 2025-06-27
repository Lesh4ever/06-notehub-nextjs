import axios from "axios";
import type { Note } from "@/types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const config = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
};

interface FetchNotesParams {
  search: string;
  page: number;
  perPage?: number;
}

export type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

export const fetchNotes = async ({
  search,
  page,
  perPage = 12,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search.trim() !== "") {
    params.search = search;
  }

  const response = await axios.get<FetchNotesResponse>(BASE_URL, {
    params,
    ...config,
  });

  return response.data;
};

export const fetchNoteById = async (id: number): Promise<Note> => {
  const response = await axios.get<Note>(`${BASE_URL}/${id}`, config);
  return response.data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const response = await axios.delete<Note>(`${BASE_URL}/${id}`, config);
  return response.data;
};

export const createNote = async (noteData: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  const response = await axios.post<Note>(BASE_URL, noteData, config);
  return response.data;
};
