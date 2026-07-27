import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { getUsers ,ViewEditUserDetails,updateUserByAdmin, removeDoctorFromClinic, removeStaffFromClinic} from "../controllers/admin.controller";
import { verify } from "crypto";

const router = express.Router();

router.get("/registeredUsers/:id" , verifyToken , getUsers);
router.get("/view_edit_user/:id" , verifyToken , ViewEditUserDetails);
router.patch("/user_update/:id/:userId" , verifyToken , updateUserByAdmin);
router.delete("/remove_doc/:id" , verifyToken , removeDoctorFromClinic);
router.delete("/remove_staff/:id" , verifyToken , removeStaffFromClinic);

export default router;