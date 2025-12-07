import axiosClient from "@/utils/axios.client";

export interface PresignedUrlResponse {
    uploadUrl: string,
    fileUrl: string
}

export const getVideoPresignedUrl = async (fileName: string): Promise<PresignedUrlResponse> => {
    const response = await axiosClient.get(`/upload/video?fileName=${fileName}`);
    return response.data;
}

export const getAvatarPresignedUrl = async (fileName: string): Promise<PresignedUrlResponse> => {
    const response = await axiosClient.get(`upload/avatar?fileName=${fileName}`)
    return response.data;
}