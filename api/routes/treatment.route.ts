import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { createTreatmentByDoc } from "../controllers/treatment.controller";

const router = express.Router();

router.post("/" , verifyToken , createTreatmentByDoc);


export default router;