import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { getClinicWithStaffId, updateStaffImage } from "../controllers/staff.controller";

const router = express.Router();

router.get("/clinicId/:id" , verifyToken , getClinicWithStaffId);
router.put("/updateImg/:id" , verifyToken , updateStaffImage);

export default router;