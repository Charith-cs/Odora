import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    id: string;
    role: string;
    exp: number;
}

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};