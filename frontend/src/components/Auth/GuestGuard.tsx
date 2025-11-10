import type React from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { Navigate } from "react-router";
import LoadingPage from "./LoadingPage";

const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <LoadingPage />
        )
    }

    if (isAuthenticated) {
        return <Navigate to={"/"} replace />
    }

    return <>{children}</>
}

export default GuestGuard