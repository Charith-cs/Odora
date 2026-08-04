import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { getAdminNotifications, getDoctorNotifications, getStaffNotifications, getUserNotifications } from "../controllers/dashControllers/notification.controller";

const router = express.Router();

router.get("/user/:id" , verifyToken ,getUserNotifications );
router.get("/doctor/:id" , verifyToken ,getDoctorNotifications );
router.get("/staff/:id" , verifyToken ,getStaffNotifications );
router.get("/management/:id" , verifyToken ,getAdminNotifications );

export default router;