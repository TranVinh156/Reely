import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../../hooks/auth/useAuth';
import ForbiddenPage from './ForbiddenPage';
import LoadingPage from './LoadingPage';

interface RoleBasedGuardProps {
    accessibleRoles: string[];
    children: ReactNode;
}

const RoleBasedGuard = ({ accessibleRoles, children }: RoleBasedGuardProps) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <LoadingPage />
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" />;
    }

    if (!user.role || !accessibleRoles.includes(user.role.name)) {
        return (
            <ForbiddenPage />
        );
    }

    return <>{children}</>;
};

export default RoleBasedGuard;


