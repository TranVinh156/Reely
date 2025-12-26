import axiosClient from "@/utils/axios.client";

export interface Video {
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

export interface PaginationResponse<T> {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    content: T[];
}

export const getUserVideos = async (userId: number, page: number = 0, size: number = 10): Promise<PaginationResponse<Video>> => {
    const response = await axiosClient.get(`/videos/users/${userId}`, {
        params: { page, size }
    });
    return response.data;
};
