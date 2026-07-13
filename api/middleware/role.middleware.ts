import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthRequest } from "./auth.middleware";

export const authorizeRoles = (...allowedRoles: string[]) : RequestHandler => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json("Unauthorized");
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json("Access denied");
        }
        next();
    };
};

export const authorizeUserOrAdmin: RequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role === "admin") {
        return next();
    }

    if (user.role === "user" && user.id === req.params.id) {
        return next();
    }

    return res.status(403).json({ message: "Forbidden" });
};
