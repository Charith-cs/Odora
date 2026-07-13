import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: any) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (token && user) {
        switch (user.role) {
            case "admin":
                return <Navigate to="/admin_dash" replace />;
            case "doctor":
                return <Navigate to="/doctor_dash" replace />;
            case "staff":
                return <Navigate to="/staff_dash" replace />;
            default:
                return <Navigate to="/user_dash" replace />;
        }
    }

    return children;
};

export default PublicRoute;