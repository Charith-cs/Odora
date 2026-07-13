import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { getClinicWithStaffId } from "../controllers/staff.controller";

const router = express.Router();

router.get("/clinicId/:id" , verifyToken , getClinicWithStaffId);

export default router;