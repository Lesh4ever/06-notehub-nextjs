"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { createNote } from "@/lib/api";
import toast from "react-hot-toast";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .required("Title is required"),
  content: Yup.string()
    .min(10, "Content must be at least 10 characters")
    .required("Content is required"),
  tag: Yup.string().required("Tag is required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      tag: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await createNote(values);
        toast.success("Note created successfully!");
        resetForm();
        onClose();
      } catch {
        toast.error("Failed to create note");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label>
          Title
          <input
            className={css.input}
            type="text"
            name="title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title && (
            <span className={css.error}>{formik.errors.title}</span>
          )}
        </label>
      </div>

      <div className={css.formGroup}>
        <label>
          Content
          <textarea
            className={css.textarea}
            name="content"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.content}
          />
          {formik.touched.content && formik.errors.content && (
            <span className={css.error}>{formik.errors.content}</span>
          )}
        </label>
      </div>

      <div className={css.formGroup}>
        <label>
          Tag
          <input
            className={css.input}
            type="text"
            name="tag"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.tag}
          />
          {formik.touched.tag && formik.errors.tag && (
            <span className={css.error}>{formik.errors.tag}</span>
          )}
        </label>
      </div>

      <div className={css.actions}>
        <button className={css.cancelButton} type="button" onClick={onClose}>
          Cancel
        </button>
        <button
          className={css.submitButton}
          type="submit"
          disabled={formik.isSubmitting}
        >
          Create
        </button>
      </div>
    </form>
  );
}
