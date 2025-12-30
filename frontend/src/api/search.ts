import axiosClient from "@/utils/axios.client";

export type PageResponse<T> = {
  page: number;
  size: number;
  totalElements: number;
  content: T[];
};

// Backend DTOs
export type SearchVideoDTO = {
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

export type SearchUserDTO = {
  id: number;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  isFollowed?: boolean | null;
};

export type SearchTagDTO = {
  id: number;
  name: string;
  videoCount?: number | null;
};

export async function searchVideos(q: string, page = 0, size = 10) {
  const res = await axiosClient.get<PageResponse<SearchVideoDTO>>("/search/videos", {
    params: { q, page, size },
  });
  return res.data;
}

export async function searchUsers(q: string, page = 0, size = 10) {
  const res = await axiosClient.get<PageResponse<SearchUserDTO>>("/search/users", {
    params: { q, page, size },
  });
  return res.data;
}

export async function searchTags(q: string, page = 0, size = 10) {
  const res = await axiosClient.get<PageResponse<SearchTagDTO>>("/search/tags", {
    params: { q, page, size },
  });
  return res.data;
}

export async function fetchVideosByTag(tagName: string, page = 0, size = 10) {
  const res = await axiosClient.get<PageResponse<SearchVideoDTO>>(
    `/tags/${encodeURIComponent(tagName)}/videos`,
    { params: { page, size } },
  );
  return res.data;
}
