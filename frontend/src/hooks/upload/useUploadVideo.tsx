import axiosClient from "@/utils/axios.client";
import { a, desc } from "motion/react-client";
import React, { createContext, useContext, useState } from "react";
import axios from "axios";

interface UploadContextType {
    uploadVideo: (userId: number | undefined, title: string, description: string, file: File) => Promise<void>;
    uploading: boolean;
    progress: number;
}
export const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider = ({ children }: { children: React.ReactNode }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    
    const uploadVideo = async (userId: number | undefined, title: string, description: string, file: File) => {
        if (!file) return;

        setUploading(true);
        try {
            const urlResponse = await axiosClient.post(`/videos/presigned-url?videoname=${file.name}`, {
            }).then(res => res.data);

            console.log("Presigned URL:", urlResponse);

            await axios.put(urlResponse, file, {
                headers: {
                    "Content-Type": file.type,
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.lengthComputable && progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        console.log(`Upload progress: ${percent}%`);
                        setProgress(percent);
                    }
                }
            });

            const videoUrl = urlResponse.split("?")[0].replace("http://localhost:9000", "");

            const duration = await getVideoDuration(file);
            console.log("Video duration (s):", duration);
            await axiosClient.post('/videos', {
                userId,
                title,
                description,
                visibility: "PUBLIC",
                originalS3Key: videoUrl,
                defaultRenditionId: 1,
                duration
            });
        } catch (error) {
            console.error("Error uploading video:", error);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    }

    const getVideoDuration = (file: File): Promise<number> => {
        return new Promise((resolve) => {
            const video = document.createElement("video");
            video.preload = "metadata";

            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                resolve(Math.round(video.duration));
            };

            video.onerror = () => {
                resolve(0);
            };

            video.src = URL.createObjectURL(file);
        });
    };
    return (
        <UploadContext.Provider value={{ uploadVideo, uploading, progress }}>
            {children}
        </UploadContext.Provider>
    );
}

export const useUpload = () => {
    const context = useContext(UploadContext);
    if (!context) {
        throw new Error('useUpload must be used within UploadProvider');
    }
    return context;
};

