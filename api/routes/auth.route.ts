import express from "express";
import { userRegister , userLogin, userUpdate, deleteUser, getCurrentUser } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register" , userRegister);
router.post("/login" , userLogin);
router.put("/update/:id" , userUpdate);
router.delete("/delete/:id" , deleteUser);
router.get("/me", verifyToken, getCurrentUser);

export default router;