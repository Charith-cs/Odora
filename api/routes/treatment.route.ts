import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { createTreatmentByDoc, updateTreatmentByDoc } from "../controllers/treatment.controller";

const router = express.Router();

router.post("/" , verifyToken , createTreatmentByDoc);
router.put("/:id" , verifyToken , updateTreatmentByDoc);

export default router;