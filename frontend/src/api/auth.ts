import axiosClient from '../utils/axios.client';

interface LoginResponse {
    accessToken: string;
    user: {
        id: number;
        username: string;
        email: string;
        displayName: string;
        bio: string;
        avatarUrl: string;
    };
}

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