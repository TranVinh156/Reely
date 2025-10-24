import { Navigate } from "react-router";
import { useAuth } from "../../hooks/auth/useAuth"

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>
        {children}
    </>;
}

export default AuthGuard