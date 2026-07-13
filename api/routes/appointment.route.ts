import express from "express";
import { createAppointment, getAll , getOne , getMy ,deleteAppointment, getDetails, getClinicAppointment, approveAppointment , cancelAppointment} from "../controllers/appointment.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/" , verifyToken ,createAppointment);
router.get("/" ,verifyToken ,  getAll);
router.get("/my/:id" ,verifyToken ,  getMy);
router.get("/:id", verifyToken , getOne);
router.delete("/:id", verifyToken , deleteAppointment); 
router.get("/treat/:id", verifyToken , getDetails); 
router.get("/get/:id" , verifyToken , getClinicAppointment);
router.put("/approve/:id" , verifyToken , approveAppointment);
router.put("/cancel/:id" , verifyToken , cancelAppointment);

export default router;