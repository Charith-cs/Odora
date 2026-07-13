import express from "express";
import { searchPosts } from "../controllers/search.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/" ,verifyToken , searchPosts);

export default router;