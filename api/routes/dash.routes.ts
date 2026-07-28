import express from "express";
import { dashCard , imgUpload , imgRemove,getChartDataForAdmin ,getChartDataForDocDash , getChartDataForDocStaff , reportDashCard, getAppointmentAnalytics, getRevenueTrend, docPerformanceReport, userPieChart , patientReport, revenueReport, appointmentReport, patientDemographicReport} from "../controllers/dashControllers/userDash.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { upload } from "../utility/multer";

const router = express.Router();

router.get("/card/:id" , dashCard);
router.post("/upload/:id" , upload.single("image") , verifyToken , imgUpload);
router.delete("/remove/:id" , verifyToken , imgRemove);
router.get("/data/:id" , verifyToken , getChartDataForDocDash);
router.get("/rev_data/:id" , verifyToken , getChartDataForAdmin);
router.get("/per_rev_data/:id" , verifyToken , getChartDataForDocStaff);
router.get("/report_dash/:id" , verifyToken , reportDashCard);
router.get("/appointments" , verifyToken , getAppointmentAnalytics);
router.get("/revenue" , verifyToken , getRevenueTrend);
router.get("/users/:id" , verifyToken , userPieChart);

//report routes

router.get("/doctor_performance/:id" , verifyToken , docPerformanceReport);
router.get("/patient_report/:id" , verifyToken , patientReport);
router.get("/revenue_report/:id" , verifyToken , revenueReport);
router.get("/appointment_report/:id" , verifyToken , appointmentReport);
router.get("/demographic_report" , verifyToken , patientDemographicReport);

export default router;