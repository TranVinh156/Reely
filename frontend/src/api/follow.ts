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

export const getFollowersCount = async (id: number): Promise<number> => {
    const response = await axiosClient.get(`/users/${id}/followers/count`);
    return response.data;
}

export const getFollowingCount = async (id: number): Promise<number> => {
    const response = await axiosClient.get(`/users/${id}/following/count`);
    return response.data;
}

export const follow = async (followerId: number, followingId: number): Promise<void> => {
    await axiosClient.post(`/users/${followerId}/follow/${followingId}`);
}

export const unfollow = async (followerId: number, followingId: number): Promise<void> => {
    await axiosClient.delete(`/users/${followerId}/unfollow/${followingId}`);
}

export const isFollowing = async (followerId: number, followingId: number): Promise<boolean> => {
    const response = await axiosClient.get(`/users/${followerId}/following/${followingId}`);
    return response.data;
}