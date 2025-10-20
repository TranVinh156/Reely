// import axios from "axios";

// export type User = {
//     id: number;
//     username: string;
//     display_name?: string;
//     avatar_url?: string;
// }

// export type FeedItem = {
//     id: number;
//     user: User;
//     video_url: string;
//     title?: string;
//     description?: string;
//     like_count: number;
//     comment_count: number;
//     is_liked: boolean;
//     create_at: string;
// }

// export type CommentItem = {
//     id: number;
//     user: User;
//     text: string;
//     create_at: string;
// }

// const client = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE || "",
//     withCredentials: true,
// });

// export const fetchFeed = async (page=0, size=4): Promise<{items: FeedItem[]; hasMore: boolean}> => {
//     const { data } = await client.get(`/api/feed`, {params: {page, size}});
//     return data;
// };

// export const toggleLike = async (videoId: number) => {
//     const { data } = await client.post(`/api/interactions/like/${videoId}`);
//     return data;
// };

// export const fetchComments = async (videoId: number): Promise<CommentItem[]> => {
//     const { data } = await client.get(`/api/comments`, {params: {videoId}});
//     return data;
// };

// export const postComment = async (videoId: number, text: String) => {
//     const { data } = await client.post(`/api/comments`, {videoId, text});
//     return data
// };


import type { FeedResponse } from "../types/video";
import { fetchFeedMock, fetchVideoMock } from "../features/feed/feed.mock";

export async function fetchFeed(cursor?: string, pageSize = 5): Promise<FeedResponse> {
  return fetchFeedMock(cursor, pageSize);
}

export async function fetchVideo(id: string) {
  return fetchVideoMock(id);
}