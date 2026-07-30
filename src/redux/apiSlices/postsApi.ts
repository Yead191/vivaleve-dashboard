import { api } from "../api/baseApi";
import { normalizeMediaList } from "../../utils/media";

export type PostType = "IMAGE" | "VIDEO";

export interface PostAuthor {
  _id: string;
  name: string;
  email?: string;
  profile?: string;
}

export interface Post {
  _id: string;
  description: string;
  content: string[];
  user: string | PostAuthor;
  type: PostType;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface PostResponse {
  success: boolean;
  message: string;
  data: Post;
}

export const getPostUserId = (user: Post["user"]) =>
  typeof user === "string" ? user : user._id;

export const getPostAuthor = (user: Post["user"]): PostAuthor | null => {
  if (typeof user === "string") {
    return { _id: user, name: "User" };
  }

  return user;
};

const postsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPostById: builder.query<Post, string>({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: "GET",
      }),
      transformResponse: (response: PostResponse) => ({
        ...response.data,
        content: normalizeMediaList(response.data.content),
      }),
      providesTags: (_result, _error, postId) => [{ type: "Post", id: postId }],
    }),
  }),
});

export const { useGetPostByIdQuery } = postsApi;
