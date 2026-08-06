import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isTokenExpired, logout } from "../../utils/auth";
import API from "../../api/axios";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles, }: ProtectedRouteProps) => {

    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [verifiedUser, setVerifiedUser] = useState<any>(null);

    const token = localStorage.getItem("token");

    useEffect(() => {

        const validateSession = async () => {
            if (!token) {
                setAuthenticated(false);
                setLoading(false);
                return;
            }

            if (isTokenExpired(token)) {
                logout();

                setAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                const res = await API.get("/auth/me");
                const user = res.data.user;

                if (!user) {
                    logout();
                    setAuthenticated(false);
                    return;
                }

                localStorage.setItem("user", JSON.stringify(user));

                setVerifiedUser(user);
                setAuthenticated(true);

            } catch (err) {

                logout();
                setVerifiedUser(null);
                setAuthenticated(false);

            } finally {

                setLoading(false);
            }
        };
        validateSession();
    }, [token]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3">
                    <div className=" h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#2596be]" />
                    <p className="text-sm text-gray-500">Checking session...</p>
                </div>
            </div>
        );
    }

    if (!authenticated || !verifiedUser) {
        return (
            <Navigate to="/auth" replace />);
    }

    if (allowedRoles && !allowedRoles.includes(verifiedUser.role)) {
        return (
            <Navigate to="/" replace />
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;