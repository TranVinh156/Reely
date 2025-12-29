import { useMutation } from "@tanstack/react-query";
import { getAvatarPresignedUrl, getVideoPresignedUrl } from "../../api/upload";

export const useGetAvatarPresignedUrl = () => {
    return useMutation({
        mutationFn: (fileName: string) => getAvatarPresignedUrl(fileName),
    });
};

export const useGetVideoPresignedUrl = () => {
    return useMutation({
        mutationFn: (fileName: string) => getVideoPresignedUrl(fileName),
    });
};
