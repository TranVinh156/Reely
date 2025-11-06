import { Navigate } from "react-router";
import { useAuth } from "../../hooks/auth/useAuth"
import LoadingPage from "./LoadingPage";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <LoadingPage />
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>
        {children}
    </>;
}

export default AuthGuard