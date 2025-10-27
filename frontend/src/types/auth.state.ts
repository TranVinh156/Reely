import type { User } from "./user"

export interface AuthState {
    isAuthenticated?: boolean
    token?: string
    user: User | null
}