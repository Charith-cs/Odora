import express from "express";
import { deleteUser, getUser, getUsers, updateUser , getUsersBasedOnDoctor , getUserDetailsWithAppointment } from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { authorizeUserOrAdmin } from "../middleware/role.middleware";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id" , verifyToken ,authorizeUserOrAdmin, updateUser);
router.delete("/:id" , verifyToken ,authorizeUserOrAdmin, deleteUser);
router.get("/my_patients/:id" , verifyToken , getUsersBasedOnDoctor);
router.get("/details/:id" , verifyToken , getUserDetailsWithAppointment);


export default router;