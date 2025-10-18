export interface User {
    id: number;
    username: string;
    email: string;
    displayName: string;
    bio: string;
    avatarUrl: string;
    createdAt?: string;
    updatedAt?: string;
}