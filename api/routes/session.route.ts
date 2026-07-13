import express from "express";
import  {getAllSessions,getDoctorSessions,createSessionTemplate,updateSessionTemplate,cancelSession} from "../controllers/session.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router  = express.Router();

router.get("/" ,verifyToken, getAllSessions); // get all
router.get("/doctor/:id" ,verifyToken, getDoctorSessions); // get doctor specific session using doctor id or clinic Id
router.post("/" ,verifyToken, createSessionTemplate); //create session
router.put("/update/:id" ,verifyToken, updateSessionTemplate); //update session
router.delete("/:id" ,verifyToken, cancelSession); //delete session

export default router;