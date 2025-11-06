import type { User } from '@/types/user';
import axiosClient from '../utils/axios.client';

export const getFollowers = async (id: number): Promise<User[]> => {
    const response = await axiosClient.get(`/users/${id}/followers`);
    return response.data;
};

export const getFollowing = async (id: number): Promise<User[]> => {
    const response = await axiosClient.get(`/users/${id}/following`);
    return response.data;
};