import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { getCompleted , createPayment } from "../controllers/billing.controller";

const router = express.Router();

router.get("/completed/:id" , verifyToken , getCompleted);
router.post("/payment" , verifyToken , createPayment);

export default router;