import axiosClient from "@/utils/axios.client";

export interface PresignedUrlResponse {
    uploadUrl: string,
    fileUrl: string
}

export interface ChunkInitResponse {
    uploadId: string;
    objectName: string;
    fileUrl: string;
    chunkSize: number;
}

export interface ChunkCompleteResponse {
    fileUrl: string;
}

export const getVideoPresignedUrl = async (fileName: string): Promise<PresignedUrlResponse> => {
    const response = await axiosClient.get(`/upload/video?fileName=${fileName}`);
    return response.data;
}

export const getAvatarPresignedUrl = async (fileName: string): Promise<PresignedUrlResponse> => {
    const response = await axiosClient.get(`upload/avatar?fileName=${fileName}`)
    return response.data;
}

/**
 * chunked upload APIs
 */

export const initVideoChunkUpload = async (fileName: string): Promise<ChunkInitResponse> => {
    const response = await axiosClient.post(`/upload/video/chunk/init?fileName=${encodeURIComponent(fileName)}`);
    return response.data;
}

export const uploadVideoChunk = async (args: {
    uploadId: string;
    partNumber: number;
    totalParts: number;
    chunk: Blob;
    onProgress?: (loaded: number, total: number) => void;
}): Promise<void> => {
    const fd = new FormData();
    fd.append('uploadId', args.uploadId);
    fd.append('partNumber', args.partNumber.toString());
    fd.append('totalParts', args.totalParts.toString());
    fd.append('chunk', args.chunk);

    await axiosClient.post(`/upload/video/chunk`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
            if (args.onProgress && e.total) args.onProgress(e.loaded, e.total);
        },
    });
}

export const completeVideoChunkUpload = async (args: {
    uploadId: string;
    objectName: string;
    totalParts: number;
}): Promise<ChunkCompleteResponse> => {
    const res = await axiosClient.post(`/upload/video/chunk/complete`, args);
    return res.data;
}

export const abortVideoChunkUpload = async (uploadId: string): Promise<void> => {
    await axiosClient.delete(`/upload/video/chunk/abort`, { params: { uploadId } });
}