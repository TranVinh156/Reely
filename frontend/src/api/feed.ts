import axiosClient from "@/utils/axios.client";
import type { FeedResponse, Video } from "@/types/video";
import { resolveMediaUrl } from "@/utils/media";

export type FeedMode = "personal" | "public" | "trending";

type BackendFeedVideoDTO = {
  videoId: number;
  title?: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  userId: number;
  username: string;
  avatarUrl?: string | null;
  likeCount?: number | null;
  commentCount?: number | null;
  viewCount?: number | null;
  durationSeconds?: number | null;
  tags?: string[] | null;
  isLiked?: boolean | null;
  isFollowed?: boolean | null;
  createdAt?: string;
};

type BackendFeedResponse = {
  page: number;
  size: number;
  totalElements: number;
  content: BackendFeedVideoDTO[];
};

function mapDtoToVideo(dto: BackendFeedVideoDTO): Video {
  return {
    id: String(dto.videoId),
    user: {
      id: String(dto.userId),
      username: dto.username,
      avatar: resolveMediaUrl(dto.avatarUrl ?? ""),
    },
    src: resolveMediaUrl(dto.videoUrl),
    poster: resolveMediaUrl(dto.thumbnailUrl) ?? "/posters/poster1.jpg",
    description: dto.description ?? dto.title ?? "",
    likes: Number(dto.likeCount ?? 0),
    comments: Number(dto.commentCount ?? 0),
    shares: 0,
    duration: Number(dto.durationSeconds ?? 0),
    tags: dto.tags ?? [],
  };
}

export async function fetchFeed(
  cursor?: string,
  pageSize = 5,
  mode: FeedMode = "personal",
): Promise<FeedResponse> {
  const page = cursor ? Math.max(0, parseInt(cursor, 10)) : 0;

  const endpoint =
    mode === "trending" ? "/feed/trending" : mode === "public" ? "/feed/public" : "/feed";

  const res = await axiosClient.get(endpoint, {
    params: { page, size: pageSize },
  });

  const data = res.data as BackendFeedResponse;
  const videos = (data.content ?? []).map(mapDtoToVideo);
  const hasMore = (data.page + 1) * data.size < (data.totalElements ?? 0);
  const nextCursor = hasMore ? String(data.page + 1) : undefined;
  return { videos, hasMore, nextCursor };
}

export async function fetchVideo(videoId: string | number) {
  const res = await axiosClient.get(`/feed/video/${videoId}`);
  return res.data;
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