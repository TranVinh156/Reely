import type { User } from "@/types/user";
import axiosClient from "@/utils/axios.client"

interface UpdateProfileRequest {
    username: string,
    displayName: string,
    bio: string
}

export const getUserByUsername = async (username: string): Promise<User> => {
    const response = await axiosClient.get(`/users/search?username=${username}`);
    return response.data;
}

export const updateUserProfile = async (request: UpdateProfileRequest): Promise<User> => {
    const response = await axiosClient.put('/users/me', request)
    return response.data;
}