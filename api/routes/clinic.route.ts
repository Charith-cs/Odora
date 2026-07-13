import express from "express";
import { registerClinic, getClinic, getAllClinics, updateClinic, deleteClinic, addDoctors,getRegisteredDoctors } from "../controllers/clinic.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/",verifyToken, registerClinic);
router.get("/",verifyToken, getAllClinics);
router.get("/:id",verifyToken, getClinic);
router.put("/:id",verifyToken, updateClinic);
router.delete("/:id",verifyToken, deleteClinic);
router.put("/addDoc/:id",verifyToken, addDoctors);
router.get("/doctors/:id",verifyToken, getRegisteredDoctors);

export default router; 