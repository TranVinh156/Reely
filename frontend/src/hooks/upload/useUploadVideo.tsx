import axiosClient from "@/utils/axios.client";
import { a, desc } from "motion/react-client";
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import {
  abortVideoChunkUpload,
  completeVideoChunkUpload,
  initVideoChunkUpload,
  uploadVideoChunk,
} from "@/api/upload";

interface UploadContextType {
  uploadVideo: (
    userId: number | undefined,
    title: string,
    description: string,
    file: File,
    thumbnail: string,
    tags?: string[],
  ) => Promise<void>;
  uploading: boolean;
  progress: number;
  uploadThumbnail: string | null;
}
export const UploadContext = createContext<UploadContextType | undefined>(
  undefined,
);

export const getVideoDuration = (file: File): Promise<number> => {
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

export const UploadProvider = ({ children }: { children: React.ReactNode }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadThumbnail, setUploadThumbnail] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const uploadVideo = async (
    userId: number | undefined,
    title: string,
    description: string,
    file: File,
    thumbnail: string,
    tags?: string[],
  ) => {
    if (!file) return;

    setUploading(true);
    setUploadThumbnail(thumbnail);
    const MAX_RETRY = 3;
    let uploadId: string | null = null;

    try {
      // Step 1: Initialize chunked upload
      const init = await initVideoChunkUpload(file.name);
      uploadId = init.uploadId;
      const chunkSize = init.chunkSize || 5 * 1024 * 1024; // default to 5MB
      const objectName = init.objectName;

      const totalParts = Math.ceil(file.size / chunkSize);
      let uploadedBytes = 0;

      // Step 2: Upload chunks
      for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
        const start = (partNumber - 1) * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        let attempt = 0;
        while (true) {
          try {
            await uploadVideoChunk({
              uploadId,
              partNumber,
              totalParts,
              chunk,
              onProgress: (loaded, _total) => {
                const current = uploadedBytes + loaded;
                const percent = Math.floor((current * 100) / file.size);
                setProgress(Math.min(99, Math.max(0, percent)));
              },

            });
            uploadedBytes += end - start;
            break; // exit retry loop on success
          } catch (error) {
            attempt++;
            if (attempt >= MAX_RETRY) {
              throw error;
            }
            await new Promise((r) => setTimeout(r, 500 * attempt));
          }
        }
      }

      // Step 3: Complete upload
      const completed = await completeVideoChunkUpload({
        uploadId,
        objectName,
        totalParts,
      });

      // Step 4: Create video record
      const durationSeconds = await getVideoDuration(file);
      const response = await axiosClient.post("/videos", {
        userId,
        title,
        description,
        visibility: "PUBLIC",
        originalS3Key: completed.fileUrl,
        defaultRenditionId: "original",
        duration: durationSeconds,
        tags: tags || [],
      });

      const newVideo = response.data;
      setProgress(100);
      queryClient.setQueriesData({ queryKey: ["user-videos", userId] }, (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;

        const newPages = [...oldData.pages];
        if (newPages.length > 0) {
          newPages[0] = {
            ...newPages[0],
            content: [newVideo, ...newPages[0].content]
          };
        }
        return { ...oldData, pages: newPages };
      });

      queryClient.invalidateQueries({ queryKey: ["user-videos", userId] });

      setProgress(100);
    } catch (error) {
      console.error("Error uploading video:", error);
      if (uploadId) {
        try {
          await abortVideoChunkUpload(uploadId);
        } catch {}
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  
  return (
    <UploadContext.Provider value={{ uploadVideo, uploading, progress, uploadThumbnail }}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used within UploadProvider");
  }
  return context;
};


