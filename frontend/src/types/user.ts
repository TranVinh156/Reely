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
// export interface User {
//     id: number;
//     username: string;
//     display_name?: string;
//     avatar_url?: string;
// }