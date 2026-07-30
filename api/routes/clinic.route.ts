import express from "express";
import { registerClinic, getClinic, getAllClinics, updateClinic, /* deleteClinic */ addDoctors, getRegisteredDoctors, requestJoinClinic, getMyPendingRequests, approveDoctorRequest, rejectDoctorRequest, addDoctorToClinicList, getClinicForAdmin } from "../controllers/clinic.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", verifyToken, registerClinic);
router.get("/", verifyToken, getAllClinics);
router.get("/:id", verifyToken, getClinic);
router.put("/:id", verifyToken, updateClinic);
/* router.delete("/:id", verifyToken, deleteClinic); */
router.put("/addDoc/:id", verifyToken, addDoctors);
router.get("/doctors/:id", verifyToken, getRegisteredDoctors);
//
router.post("/request-join/:clinicId", verifyToken, requestJoinClinic);
router.get("/pending_request/:id", verifyToken, getMyPendingRequests);
router.patch("/approve-request/:doctorId", verifyToken, approveDoctorRequest);
router.patch("/reject-request/:doctorId", verifyToken, rejectDoctorRequest);
router.put("/regadd/:id" , verifyToken , addDoctorToClinicList);
router.get("/my/:id" , verifyToken , getClinicForAdmin);


export default router; 