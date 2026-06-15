import * as Yup from "yup";

export const PostSchema = Yup.object({
  title: Yup.string().required("Title is required"),
});

export const CommentSchema = Yup.object({
  body: Yup.string().required("Comment is required"),
});

export const EditCommentSchema = Yup.object({
  body: Yup.string().required("Comment is required"),
});
