import axiosClient from "@/utils/axios.client";
import type { FeedResponse } from "@/types/video";

type ApiMaybeWrapped<T> = T | { data: T };

function unwrap<T>(payload: ApiMaybeWrapped<T>): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as any).data as T;
  }
  return payload as T;
}

export async function getFeed(params: { cursor?: string; pageSize?: number } = {}) {
  // Doc: GET /api/feed?cursor=&pageSize=...:contentReference[oaicite:9]{index=9}
  const res = await axiosClient.get("/feed", { params });
  return unwrap<FeedResponse>(res.data);
}

export async function likeVideo(videoId: string | number) {
  // Call the LikeController endpoint
  // Backend extracts userId from token (via Gateway X-UserId header)
  const res = await axiosClient.post(`/likes`, { videoId });
  // Backend returns the created Like object. We infer success.
  return { liked: true, likeCount: undefined as unknown as number };
}

export async function unlikeVideo(videoId: string | number) {
  const res = await axiosClient.delete(`/likes?videoId=${videoId}`);
  return { liked: false, likeCount: undefined as unknown as number };
}

// // (Optional) nếu bạn muốn chuẩn hoá comment theo doc interactions:
// export async function addComment(videoId: string | number, text: string) {
//   // Doc: POST /api/interactions/videos/{videoId}/comments:contentReference[oaicite:12]{index=12}
//   const res = await axiosClient.post(`/interactions/videos/${videoId}/comments`, { text });
//   return unwrap(res.data);
// }

// export async function getComments(videoId: string | number, params: { page?: number; size?: number } = {}) {
//   // Doc: GET /api/interactions/videos/{videoId}/comments?page=&size=:contentReference[oaicite:13]{index=13}
//   const res = await axiosClient.get(`/interactions/videos/${videoId}/comments`, { params });
//   return unwrap(res.data);
// }

import { fetchFeedMock, fetchVideoMock } from "../features/feed/feed.mock";

export async function fetchFeed(cursor?: string, pageSize = 5): Promise<FeedResponse> {
  return fetchFeedMock(cursor, pageSize);
}

export async function fetchVideo(id: string) {
  return fetchVideoMock(id);
}