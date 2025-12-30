import axiosClient from "@/utils/axios.client";
import { resolveMediaUrl } from "@/utils/media";
import type { Video } from "@/types/video";

export interface VideoDTO {
    id: number;
    userId: number;
    title: string;
    description: string;
    visibility: string;
    originalS3Key: string;
    defaultRenditionId: string;
    durationSeconds: number;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
}

type BackendVideoDetailDTO = {
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
    createdAt?: string;
};

function mapVideoDetailToVideo(dto: BackendVideoDetailDTO): Video {
    return {
        id: String(dto.videoId),
        user: {
            id: String(dto.userId),
            username: dto.username,
            avatar: resolveMediaUrl(dto.avatarUrl ?? ""),
        },
        title: dto.title ?? "",
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

export interface PaginationResponse<T> {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    content: T[];
}

export const getUserVideos = async (userId: number, page: number = 0, size: number = 10): Promise<PaginationResponse<VideoDTO>> => {
    const response = await axiosClient.get(`/videos/users/${userId}`, {
        params: { page, size }
    });
    return response.data;
};

export const getVideoById = async (id: number): Promise<Video> => {
    const response = await axiosClient.get(`/feed/video/${id}`);
    const data = response.data as BackendVideoDetailDTO;
    return mapVideoDetailToVideo(data);
}
