import { useState } from "react";
import axios from "axios";

export const useUploadFile = () => {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const uploadFile = async (uploadUrl: string, file: File) => {
        setIsUploading(true);
        setProgress(0);
        setError(null);
        try {
            await axios.put(uploadUrl, file, {
                headers: {
                    "Content-Type": file.type,
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.lengthComputable && progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percent);
                    }
                }
            });
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadFile, progress, isUploading, error };
};
