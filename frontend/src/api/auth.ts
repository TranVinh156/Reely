export const forgotPassword = async (email: string): Promise<void> => {
    await axiosClient.post('/auth/forgot-password', { email });
};

export const resetPassword = async (data: { token: string; newPassword: string }): Promise<void> => {
    await axiosClient.post('/auth/reset-password', data);
};
import type { LoginResponse } from '../hooks/auth/useLogin';
import type { RegisterCredentials } from '../hooks/auth/useRegister';
import type { User } from '../types/user';
import axiosClient from '../utils/axios.client';

interface RefreshTokenResponse {
    accessToken: string;
    user: User;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axiosClient.post('/auth/login',
        { email, password }
    );
    return response.data;
};

export const refreshToken = async (): Promise<string> => {
    const response = await axiosClient.post<RefreshTokenResponse>(
        `/auth/refresh`
    );
    return response.data.accessToken;
};

export const logout = async (): Promise<void> => {
    await axiosClient.post(`/auth/logout`);
};

export const register = async (data: RegisterCredentials): Promise<User> => {
    const response = await axiosClient.post('/auth/register', data);
    return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
    const response = await axiosClient.get('/auth/me');
    return response.data
}

export const changePassword = async (data: any): Promise<void> => {
    await axiosClient.post('/auth/change-password', data);
}