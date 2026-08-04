import express from "express";
import { searchPatients, searchPosts } from "../controllers/search.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/" ,verifyToken , searchPosts);
router.get("/patient" , verifyToken , searchPatients);

export default router;