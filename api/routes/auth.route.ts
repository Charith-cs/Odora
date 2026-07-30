import express from "express";
import { userRegister , userLogin, userUpdate, deleteUser } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register" , userRegister);
router.post("/login" , userLogin);
router.put("/update/:id" , userUpdate);
router.delete("/delete/:id" , deleteUser);

export default router;