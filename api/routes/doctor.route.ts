import express from "express";
import { doctorDetails, getDoctor,getDoctorSessionDetailsForWalkIn } from "../controllers/doctor.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/details/:id"  , doctorDetails);
router.get("/update/:id" , verifyToken , getDoctor);
router.get("/available_session/:id" , getDoctorSessionDetailsForWalkIn)

export default router;