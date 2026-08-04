import { Request, Response } from "express";
import Appointment from "../../models/appointment.model";
import Staff from "../../models/staff.model";
import Clinic from "../../models/clinic.model";

export const getUserNotifications = async (req: Request, res: Response) => {
    try {

        const id = req.params.id;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const appointments = await Appointment.find({
            userId: id,
            status: {
                $in: [
                    "approved",
                    "canceled",
                    "completed",
                    "paid"
                ]
            }
        })
            .populate("doctorId", "firstName lastName")
            .populate("clinicId", "clinicName")
            .sort({ updatedAt: -1 })
            .limit(10);

        const notifications = appointments.map((appointment: any) => {
            let message = "";
            switch (appointment.status) {

                case "approved":
                    message = "Your appointment has been approved.";
                    break;

                case "canceled":
                    message = "Your appointment has been canceled.";
                    break;

                case "completed":
                    message = "Your appointment has been completed.";
                    break;

                case "paid":
                    message = "Your payment has been completed successfully.";
                    break;
            }

            return {
                id: `${appointment._id}-${appointment.status}`,
                appointmentId: appointment._id,
                status: appointment.status,
                message,
                clinicName: appointment.clinicId?.clinicName || "Clinic",
                doctorName: appointment.doctorId ? `Dr. ${appointment.doctorId.firstName} ${appointment.doctorId.lastName}` : "",
                date: appointment.updatedAt
            };
        });

        return res.status(200).json(notifications);

    } catch (err: any) {
        return res.status(500).json({ message: "Oops! Something went wrong", error: err.message });
    }
};

export const getDoctorNotifications = async (req: Request, res: Response) => {
    try {

        const id = req.params.id;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const appointments = await Appointment.find({
            doctorId: id,
            status: {
                $in: [
                    "pending",
                    "approved",
                    "canceled",
                    "completed"
                ]
            }
        })
            .populate("userId", "firstName lastName")
            .populate("clinicId", "clinicName")
            .sort({ updatedAt: -1 })
            .limit(10);

        const notifications = appointments.map((appointment: any) => {
            let message = "";
            switch (appointment.status) {

                case "pending":
                    message = "Your have new appointment.";
                    break;

                case "approved":
                    message = "Your new appointment has been approved.";
                    break;

                case "canceled":
                    message = "Your new appointment has been canceled.";
                    break;

                case "completed":
                    message = "Your appointment has been completed.";
                    break;

            }

            return {
                id: `${appointment._id}-${appointment.status}`,
                appointmentId: appointment._id,
                status: appointment.status,
                message,
                clinicName: appointment.clinicId?.clinicName || "Clinic",
                userName: appointment.userId ? `${appointment.userId.firstName} ${appointment.userId.lastName}` : "",
                date: appointment.updatedAt
            };
        });

        return res.status(200).json(notifications);

    } catch (err: any) {
        return res.status(500).json({ message: "Oops! Something went wrong", error: err.message });
    }
};

export const getStaffNotifications = async (req: Request, res: Response) => {
    try {

        const id = req.params.id;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const isClinic = await Staff.findOne({
            userId : id
        });
        if(!isClinic) {
            return res.status(403).json({message:"Check your Id status"});
        }

        const appointments = await Appointment.find({
            clinicId: isClinic?.clinic,
            status: {
                $in: [
                    "pending",
                    "approved",
                    "canceled",
                    "completed"
                ]
            }
        })
            .populate("userId", "firstName lastName")
            .populate("doctorId", "firstName lastName")
            .populate("clinicId", "clinicName")
            .sort({ updatedAt: -1 })
            .limit(10);

        const notifications = appointments.map((appointment: any) => {
            let message = "";
            switch (appointment.status) {

                case "pending":
                    message = "Your have new appointment.";
                    break;

                case "approved":
                    message = "Appointment has been approved.";
                    break;

                case "canceled":
                    message = "Appointment appointment has been canceled.";
                    break;

                case "completed":
                    message = "Appointment appointment has been completed.";
                    break;

            }

            return {
                id: `${appointment._id}-${appointment.status}`,
                appointmentId: appointment._id,
                status: appointment.status,
                message,
                clinicName: appointment.clinicId?.clinicName || "Clinic",
                doctorName: appointment.doctorId ? `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}` : "",
                userName: appointment.userId ? `${appointment.userId.firstName} ${appointment.userId.lastName}` : "",
                date: appointment.updatedAt
            };
        });

        return res.status(200).json(notifications);

    } catch (err: any) {
        return res.status(500).json({ message: "Oops! Something went wrong", error: err.message });
    }
};

export const getAdminNotifications = async (req: Request, res: Response) => {
    try {

        const id = req.params.id;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const isClinic = await Clinic.findOne({
            managementId : id
        });
        if(!isClinic) {
            return res.status(403).json({message:"Check your Id status"});
        }

        const appointments = await Appointment.find({
            clinicId: isClinic?._id,
            status: {
                $in: [
                    "pending",
                    "approved",
                    "canceled",
                    "completed"
                ]
            }
        })
            .populate("userId", "firstName lastName")
            .populate("doctorId", "firstName lastName")
            .populate("clinicId", "clinicName")
            .sort({ updatedAt: -1 })
            .limit(10);

        const notifications = appointments.map((appointment: any) => {
            let message = "";
            switch (appointment.status) {

                case "pending":
                    message = "Your have new appointment.";
                    break;

                case "approved":
                    message = "Appointment has been approved.";
                    break;

                case "canceled":
                    message = "Appointment appointment has been canceled.";
                    break;

                case "completed":
                    message = "Appointment appointment has been completed.";
                    break;

            }

            return {
                id: `${appointment._id}-${appointment.status}`,
                appointmentId: appointment._id,
                status: appointment.status,
                message,
                clinicName: appointment.clinicId?.clinicName || "Clinic",
                doctorName: appointment.doctorId ? `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}` : "",
                userName: appointment.userId ? `${appointment.userId.firstName} ${appointment.userId.lastName}` : "",
                date: appointment.updatedAt
            };
        });

        return res.status(200).json(notifications);

    } catch (err: any) {
        return res.status(500).json({ message: "Oops! Something went wrong", error: err.message });
    }
};