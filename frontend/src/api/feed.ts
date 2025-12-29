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

type LikeToggleResponse = {
  videoId: number;
  liked: boolean;
  likeCount?: number | null;
};

type ViewResponse = {
  videoId: number;
  viewCount: number;
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
    views: Number(dto.viewCount ?? 0),
    shares: 0,
    duration: Number(dto.durationSeconds ?? 0),
    tags: dto.tags ?? [],
    isLiked: Boolean(dto.isLiked),
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
  const res = await axiosClient.post(`/likes`, { videoId });
  const data = res.data as LikeToggleResponse;
  return {
    liked: Boolean(data.liked),
    likeCount: typeof data.likeCount === "number" ? data.likeCount : undefined,
  };
}

export async function unlikeVideo(videoId: string | number) {
  const res = await axiosClient.delete(`/likes?videoId=${videoId}`);
  const data = res.data as LikeToggleResponse;
  return {
    liked: Boolean(data.liked),
    likeCount: typeof data.likeCount === "number" ? data.likeCount : undefined,
  };
}

export async function registerView(videoId: string | number) {
  const res = await axiosClient.post(`/videos/${videoId}/view`);
  const data = res.data as ViewResponse;
  return { viewCount: Number(data.viewCount ?? 0) };
}