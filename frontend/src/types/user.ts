export interface Role {
    id: number;
    name: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    displayName: string;
    bio: string;
    avatarUrl: string;
    role?: Role;
    createdAt?: string;
    updatedAt?: string;
}
