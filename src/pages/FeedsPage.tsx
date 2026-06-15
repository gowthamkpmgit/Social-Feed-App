import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getComments,
  createComment,
  toggleExpand,
  updateComment,
  type Post,
  type Comment,
} from "../auth/redux/reducers/postsSlice";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../auth/redux/reducers/usersSlice";
import { Avatar, Box, Chip, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import {
  CommentSchema,
  EditCommentSchema,
  PostSchema,
} from "./components/helperfunction";
import type { RootState, AppDispatch } from "../auth/redux/store";

function FieldError({ name }: { name: string }) {
  return (
    <ErrorMessage name={name}>
      {(msg) => <p className="mt-1 text-xs text-red-400">{msg}</p>}
    </ErrorMessage>
  );
}

const inputCls =
  "w-full bg-slate-100  rounded-lg px-3 py-2 " +
  "text-xs text-black placeholder-slate-600 outline-none " +
  "focus:border-blue-500 transition-colors";

function CreatePostForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const username = useSelector((s: RootState) => s.user.currentUser?.username);

  if (!open) {
    return (
      <Box className="flex justify-center">
        <button
          onClick={() => setOpen(true)}
          className="w-64 py-3 mb-4 rounded-2xl bg-blue-800
                   text-sm font-medium text-white
                   hover:border-blue-500 hover:bg-blue-600 transition-colors"
        >
          New Post
        </button>
      </Box>
    );
  }

  return (
    <div className="bg-gray-100 border rounded-2xl p-6 mb-6 shadow-lg">
      <p className="text-md font-semibold  text-blue-800 mb-4">Create Post</p>
      <Formik
        initialValues={{ title: "", id: "" }}
        validationSchema={PostSchema}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          dispatch(
            createPost({
              title: values.title,
              username,
            }),
          );
          resetForm();
          setOpen(false);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <div>
              <Field
                name="title"
                placeholder="What's on your mind?"
                className="w-full bg-gray-300 border rounded-lg px-4 py-2.5
                           text-sm text-black placeholder-slate-700 outline-none
                           focus:border-blue-500 transition-colors"
              />
              <FieldError name="title" />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-blue-600
                           border border-blue-600 hover:border-blue-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-1.5 rounded-lg text-sm font-semibold bg-blue-600
                           text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
              >
                Save
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

function EditPostForm({ post, onClose }: { post: Post; onClose: () => void }) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className=" bg-gray-300 px-6 py-5">
      <Formik
        initialValues={{ title: post.title, id: post.id }}
        validationSchema={PostSchema}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(
            updatePost({
              id: post.id,
              data: { title: values.title },
            }),
          );
          setSubmitting(false);
          onClose();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-3">
            <div>
              <Field
                name="title"
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-black
                           border "
              />
              <FieldError name="title" />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-blue-600
                           border border-blue-600 hover:border-blue-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-1.5 rounded-lg text-sm font-semibold bg-blue-600
                           text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
              >
                Update
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

function AddCommentForm({ postId }: { postId: number }) {
  const dispatch = useDispatch<AppDispatch>();
  const username = useSelector((s: RootState) => s.user.currentUser?.username);
  const name = useSelector((s: RootState) => s.user.currentUser?.name) ?? "";

  return (
    <Formik
      initialValues={{ body: "", email: "" }}
      validationSchema={CommentSchema}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        dispatch(
          createComment({
            postId,
            name,
            email: values.email,
            body: values.body,
            username,
          }),
        );
        resetForm();
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="mt-4 flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <Field
                as="textarea"
                name="body"
                rows={2}
                placeholder="Write a comment…"
                className={inputCls}
              />
              <FieldError name="body" />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="shrink-0 mt-3 px-1 py-1 rounded-lg text-xs font-semibold bg-blue-600
                         text-white hover:bg-blue-500 disabled:opacity-50 hover:cursor-pointer"
            >
              <SendIcon />
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

function CommentsSection({ postId }: { postId: number }) {
  const comments = useSelector((s: RootState) => s.posts.comments[postId]);

  return (
    <div className=" bg-slate-200 px-6 py-5">
      <p className="text-sm font-bold text-blue-600 mb-4">
        {comments ? `${comments.length} Comments` : "Comments"}
      </p>

      {!comments && (
        <p className="text-xs text-slate-500 animate-pulse">
          Loading comments..
        </p>
      )}

      {comments?.length === 0 && (
        <p className="text-xs text-slate-500">No comments yet</p>
      )}

      {comments && comments.length > 0 && (
        <ul className="flex flex-col gap-3 mb-1">
          {comments.map((c) => (
            <CommentItem key={c.id} postId={postId} comment={c} />
          ))}
        </ul>
      )}

      <AddCommentForm postId={postId} />
    </div>
  );
}

function PostCard({ post }: { post: Post & { username?: string } }) {
  const dispatch = useDispatch<AppDispatch>();
  const username = useSelector((s: RootState) => s.user.currentUser?.username);

  const hasComments = useSelector(
    (s: RootState) => !!s.posts.comments[post.id],
  );

  const isExpanded = useSelector(
    (s: RootState) => s.posts.expanded[post.id] ?? false,
  );
  const [editing, setEditing] = useState(false);

  const handleToggleComments = () => {
    if (!isExpanded && !hasComments) dispatch(getComments(post.id));
    dispatch(toggleExpand(post.id));
  };

  return (
    <article
      className="bg-gray-100  rounded-2xl overflow-hidden shadow-md
                 hover:border-blue-500/50 transition-colors duration-200"
    >
      <div className="px-6 py-5">
        <div className="flex justify-between">
          <h2 className="text-base font-semibold text-black  leading-snug mb-2">
            {post.title}
          </h2>
          <div>
            {post.username === username && (
              <IconButton
                onClick={() => {
                  setEditing((v) => !v);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium
                        text-black hover:cursor-pointer"
              >
                {editing ? (
                  <ClearIcon fontSize="small" className="text-black" />
                ) : (
                  <EditIcon fontSize="small" className="text-black" />
                )}{" "}
              </IconButton>
            )}
            {post.username === username && (
              <IconButton
                onClick={() => dispatch(deletePost(post.id))}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-700
                       hover:cursor-pointer"
              >
                <DeleteIcon fontSize="small" className="text-red-700" />
              </IconButton>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleToggleComments}
            className="px-4 py-1.5 rounded-lg text-sm font-medium text-blue-600 bg-blue-100
                     hover:text-blue-100 hover:bg-blue-600 transition-colors"
          >
            {isExpanded ? (
              "Hide comments"
            ) : (
              <div className="flex items-center gap-1">
                <ChatIcon fontSize="small" />
                <span>Comments</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {editing && (
        <EditPostForm post={post} onClose={() => setEditing(false)} />
      )}
      {isExpanded && <CommentsSection postId={post.id} />}
    </article>
  );
}

function CommentItem({
  postId,
  comment,
}: {
  postId: number;
  comment: Comment;
}) {
  const [editing, setEditing] = useState(false);
  const username = useSelector((s: RootState) => s.user.currentUser?.username);

  return (
    <li className="bg-slate-300 rounded-xl px-4 py-3 border-l-2 border-blue-500">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <p className="text-xs font-semibold text-blue-800">
            {comment.username}
          </p>
        </div>
        <div>
          {" "}
          {comment.username === username && (
            <IconButton
              onClick={() => setEditing((v) => !v)}
              className="shrink-0 px-2 py-0.5 rounded text-[10px] font-medium
                      text-black hover:cursor-pointer
                    "
            >
              {editing ? (
                <ClearIcon fontSize="small" className="text-black" />
              ) : (
                <EditIcon fontSize="small" className="text-black" />
              )}
            </IconButton>
          )}
        </div>
      </div>

      {editing ? (
        <EditCommentForm
          postId={postId}
          comment={comment}
          onClose={() => setEditing(false)}
        />
      ) : (
        <p className="text-xs text-black leading-relaxed mt-1">
          {comment.body}
        </p>
      )}
    </li>
  );
}

function EditCommentForm({
  postId,
  comment,
  onClose,
}: {
  postId: number;
  comment: Comment;
  onClose: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const username = useSelector((s: RootState) => s.user.currentUser?.username);

  return (
    <Formik
      initialValues={{ email: comment.email, body: comment.body }}
      validationSchema={EditCommentSchema}
      onSubmit={(values, { setSubmitting }) => {
        dispatch(
          updateComment({
            postId,
            commentId: comment.id,
            email: values.email,
            body: values.body,
            username,
          }),
        );
        setSubmitting(false);
        onClose();
      }}
    >
      {({ isSubmitting }) => (
        <Form className="mt-2 flex flex-col gap-2">
          <div>
            <Field
              as="textarea"
              name="body"
              rows={2}
              placeholder="Edit your comment…"
              className={inputCls + " resize-none"}
            />
            <FieldError name="body" />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded-lg text-[10px] font-medium text-black border
                          hover:border-slate-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1 rounded-lg text-[10px] font-semibold bg-blue-600
                         text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              Update
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

const FeedPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const username = useSelector((s: RootState) => s.user.currentUser?.username);
  const totalItems = useSelector((s: RootState) => s.posts?.items ?? []);
  const items = totalItems.slice(100, totalItems.length);
  const status = useSelector((s: RootState) => s.posts?.status ?? "idle");
  const error = useSelector((s: RootState) => s.posts?.error ?? null);

  useEffect(() => {
    if (status === "idle") dispatch(getPosts());
  }, [dispatch, status]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-blue-100 text-slate-100">
      <header className="bg-gradient-to-br from-indigo-800 to-purple-500 flex items-center justify-between py-2">
        <div className="px-4">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-blue-200">Feed</span>
          </h1>
          <div className="py-1 text-xs text-slate-400">
            {items.length} posts
          </div>
        </div>

        <div className="flex justify-end">
          <div className="px-6 flex items-center gap-2">
            <Chip
              avatar={<Avatar sx={{ width: 32, height: 32 }} />}
              label={username}
              sx={{
                fontSize: "1rem",
                height: "auto",
                borderRadius: "20px",
                padding: "6px 8px",
                color: "white",
              }}
            />
          </div>
          <div className="px-4 mt-1">
            <button
              onClick={() => {
                dispatch(logoutUser());
                navigate("/sign-in");
              }}
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </header>
      <div className=" mx-auto px-4 py-3">
        <CreatePostForm />

        {status === "loading" && (
          <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
            <div
              className="w-7 h-7 border-2 border-slate-700 border-t-blue-500
                            rounded-full animate-spin"
            />
            <p className="text-sm">Fetching posts…</p>
          </div>
        )}

        {status === "failed" && (
          <p className="text-center text-sm text-red-400 py-10">
            Error: {error}
          </p>
        )}

        {status === "succeeded" && items.length === 0 && (
          <p className="text-center text-sm text-slate-800 py-2">
            No posts available yet
          </p>
        )}
        <div className="flex flex-col gap-4">
          {items.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default FeedPage;
