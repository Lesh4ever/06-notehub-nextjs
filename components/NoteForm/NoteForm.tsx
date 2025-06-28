"use client";

import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { type NoteFormData } from "@/types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Too short title, min 3 symbols")
    .max(50, "Too long title, max 50 symbols")
    .required("Title is required"),
  content: Yup.string().max(500, "Too long content, max 500 symbols"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const addNewNote = useMutation({
    mutationFn: (newNoteData: NoteFormData) => createNote(newNoteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  const handleSubmit = (
    values: NoteFormData,
    actions: FormikHelpers<NoteFormData>
  ) => {
    addNewNote.mutate(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={{
        title: "",
        content: "",
        tag: "Todo",
      }}
      validationSchema={NoteFormSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field type="text" name="title" id="title" className={css.input} />
          <ErrorMessage name="title" component="div" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            name="content"
            id="content"
            rows="6"
            className={css.textarea}
          />
          <ErrorMessage name="content" component="div" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" name="tag" id="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="div" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton}>
            {addNewNote.isPending && !addNewNote.isSuccess
              ? "Creating..."
              : "Create note"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
