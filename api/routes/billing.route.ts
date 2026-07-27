import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { getCompleted , createPayment, getInvoiceByBillingId } from "../controllers/billing.controller";

const router = express.Router();

router.get("/completed/:id" , verifyToken , getCompleted);
router.post("/payment" , verifyToken , createPayment);
router.get("/invoice/:id", verifyToken , getInvoiceByBillingId);

export default router;