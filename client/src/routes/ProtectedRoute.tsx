import { Navigate } from "react-router-dom";
import { isTokenExpired, logout } from "../../utils/auth";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles,}: ProtectedRouteProps) => {

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (isTokenExpired(token)) {
        logout();
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles &&!allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;