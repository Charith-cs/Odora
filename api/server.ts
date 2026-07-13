// src/server.ts
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route";
import clinicRoute from "./routes/clinic.route";
import userRoute from "./routes/user.route";
import searchRoute from "./routes/search.route";
import doctorRoute from "./routes/doctor.route";
import sessionRoute from "./routes/session.route";
import appointmentRoute from "./routes/appointment.route";
import dashRoute from "./routes/dash.routes";
import treatmentRoute from "./routes/treatment.route";
import staffRoute from "./routes/staff.route";
import billingRoute from "./routes/billing.route";
import adminRoute from "./routes/admin.route";
import path from "path";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(
    "/upload",
    express.static(path.join(__dirname, "./public/upload"))
);


const MONGO_URL = process.env.MONGODB_URL;
if (!MONGO_URL) {
  throw new Error("Please check your Connection string");
}
mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


app.use("/api/auth" , authRoute);
app.use("/api/clinic" , clinicRoute);
app.use("/api/user" , userRoute);
app.use("/api/search" , searchRoute);
app.use("/api/doctor" , doctorRoute);
app.use("/api/session", sessionRoute);
app.use("/api/appointment", appointmentRoute);
app.use("/api/dash", dashRoute);
app.use("/api/treatment", treatmentRoute);
app.use("/api/staff", staffRoute);
app.use("/api/billing", billingRoute);
app.use("/api/management" , adminRoute);


app.listen(5000, () => {
  console.log("Server running on port 5000");
});