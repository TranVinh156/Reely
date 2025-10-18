import type { LoginResponse } from '../hooks/auth/useLogin';
import type { RegisterCredentials } from '../hooks/auth/useRegister';
import type { User } from '../types/user';
import axiosClient from '../utils/axios.client';

interface RefreshTokenResponse {
    accessToken: string;
    user: any;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axiosClient.post('/auth/login',
        { email, password }
    );
    return response.data;
};

export const refreshToken = async (): Promise<string> => {
    try {
        const response = await axiosClient.post<RefreshTokenResponse>(
            `/auth/refresh`
        );
        return response.data.accessToken;
    } catch (error) {
        throw new Error('Failed to refresh token');
    }
};

export const logout = async (): Promise<void> => {
    await axiosClient.post(`/auth/logout`);
};

export const register = async (data: RegisterCredentials): Promise<User> => {
    const response = await axiosClient.post('/auth/register', data);
    return response.data;
};