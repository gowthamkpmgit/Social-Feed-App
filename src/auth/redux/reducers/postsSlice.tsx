import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { logoutUser } from "./usersSlice";

const baseUrl = "https://jsonplaceholder.typicode.com";

export interface Post {
  id: number;
  title: string;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
  username?: string;
}

interface PostsState {
  items: Post[];
  comments: Record<number, Comment[]>;
  expanded: Record<number, boolean>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const getPosts = createAsyncThunk("posts/getAll", async () => {
  const res = await axios.get<Post[]>(`${baseUrl}/posts`);
  return res.data;
});

export const createPost = createAsyncThunk(
  "posts/create",
  async (data: { title: string; username?: string }) => {
    const res = await axios.post<Post>(`${baseUrl}/posts`, data);
    return { ...res.data, username: data.username };
  },
);

export const updatePost = createAsyncThunk(
  "posts/update",
  async ({ id, data }: { id: number; data: Omit<Post, "id"> }) => {
    await axios.patch<Post>(`${baseUrl}/posts/${id}`, data);
    return { id, ...data };
  },
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async (id: number) => {
    await axios.delete(`${baseUrl}/posts/${id}`);
    return id;
  },
);

export const getComments = createAsyncThunk(
  "posts/getComments",
  async (postId: number) => {
    const res = await axios.get<Comment[]>(
      `${baseUrl}/posts/${postId}/comments`,
    );
    return { postId, comments: res.data };
  },
);

export const createComment = createAsyncThunk(
  "posts/createComment",
  async ({
    postId,
    name,
    email,
    body,
    username,
  }: {
    postId: number;
    name: string;
    email: string;
    body: string;
    username?: string;
  }) => {
    await axios.post<Comment>(`${baseUrl}/comments`, {
      postId,
      name,
      email,
      body,
      username,
    });
    return {
      postId,
      comment: { id: Date.now(), postId, name, email, body, username },
    };
  },
);

export const updateComment = createAsyncThunk(
  "posts/updateComment",
  async ({
    postId,
    commentId,
    email,
    body,
    username,
  }: {
    postId: number;
    commentId: number;
    email: string;
    body: string;
    username?: string;
  }) => {
    const isLocalComment = commentId > 500;
    if (!isLocalComment) {
      await axios.put<Comment>(`${baseUrl}/comments/${commentId}`, {
        email,
        body,
        username,
      });
    }
    return { postId, commentId, email, body };
  },
);

const initialState: PostsState = {
  items: [],
  comments: {},
  expanded: {},
  status: "idle",
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    toggleExpand(state, { payload: id }: { payload: number }) {
      state.expanded[id] = !state.expanded[id];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (s) => {
        s.status = "loading";
      })
      .addCase(getPosts.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload ?? [];
      })
      .addCase(getPosts.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message ?? "Unknown error";
      })

      .addCase(createPost.fulfilled, (s, a) => {
        const payload = { ...a.payload, id: Number(s.items.length + 1) };
        s.items.push(payload);
      })

      .addCase(updatePost.fulfilled, (s, a) => {
        const i = s.items.findIndex((p) => p.id === a.payload.id);
        if (i !== -1) s.items[i] = { ...s.items[i], ...a.payload };
      })

      .addCase(deletePost.fulfilled, (s, a) => {
        s.items = s.items.filter((p) => p.id !== a.payload);
        delete s.comments[a.payload];
        delete s.expanded[a.payload];
      })

      .addCase(getComments.fulfilled, (s, a) => {
        s.comments[a.payload.postId] = a.payload.comments;
      })

      .addCase(createComment.fulfilled, (s, a) => {
        const { postId, comment } = a.payload;
        s.comments[postId] = [...(s.comments[postId] ?? []), comment];
      })
      .addCase(updateComment.fulfilled, (s, a) => {
        const { postId, commentId, email, body } = a.payload;
        const list = s.comments[postId];
        if (!list) return;
        const i = list.findIndex((c) => c.id === commentId);
        if (i !== -1) {
          s.comments[postId][i] = { ...list[i], email, body };
        }
      })
      .addCase(logoutUser, (s) => {
        s.expanded = {};
      });
  },
});

export const { toggleExpand } = postsSlice.actions;
export default postsSlice.reducer;
