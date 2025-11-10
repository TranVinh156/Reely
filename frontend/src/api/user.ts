import type { User } from "@/types/user";
import axiosClient from "@/utils/axios.client"

export const getUserByUsername = async (username: string): Promise<User> => {
    const response = await axiosClient.get(`/users/search?username=${username}`);
    return response.data;
}