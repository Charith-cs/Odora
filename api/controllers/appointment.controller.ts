import { Request, Response } from "express";
import Session from "../models/session.model";
import Appointment from "../models/appointment.model";
import User from "../models/user.model";
import Treatment from "../models/Treatment.model";
import mongoose from "mongoose";
import Staff from "../models/staff.model";


export const createAppointment = async (req: Request, res: Response) => {
    try {
        const { userId, sessionId, dateTime, method, fee } = req.body;

        const session = await Session.findById(sessionId);

        if (!session || session.status !== "active") {
            return res.status(404).json({ message: "Session not available" });
        }

        const bookingDate = new Date(dateTime);

        if (isNaN(bookingDate.getTime())) {
            return res.status(400).json({ message: "Invalid dateTime" });
        }

        if (
            bookingDate < session.startDateTime ||
            bookingDate > session.endDateTime
        ) {
            return res.status(400).json({
                message: "Outside session time"
            });
        }


        const userConflict = await Appointment.findOne({
            userId,
            sessionId,
            dateTime,
            status: { $ne: "cancelled" }
        });

        if (userConflict) {
            return res.status(400).json({
                message: "You already booked this time"
            });
        }


        if (session.bookedPatients >= session.maxPatientsPerHour) {
            return res.status(400).json({
                message: "Session is fully booked"
            });
        }


        if (session.maxPatientsPerHour) {
            const startOfHour = new Date(bookingDate);
            startOfHour.setMinutes(0, 0, 0);

            const endOfHour = new Date(startOfHour);
            endOfHour.setHours(endOfHour.getHours() + 1);

            const hourlyCount = await Appointment.countDocuments({
                sessionId,
                dateTime: {
                    $gte: startOfHour,
                    $lt: endOfHour
                },
                status: { $ne: "cancelled" }
            });

            if (hourlyCount >= session.maxPatientsPerHour) {
                return res.status(400).json({
                    message: "Too many patients in this hour"
                });
            }
        }


        const appointment = await Appointment.create({
            userId,
            doctorId: session.doctorId,
            clinicId: session.clinicId,
            sessionId,
            dateTime: bookingDate,
            fee: fee,
            method: method || "visit",
            status: "pending"
        });


        await Session.findByIdAndUpdate(sessionId, {
            $inc: { bookedPatients: 1 }
        });

        return res.status(201).json({
            message: "Appointment created successfully",
            appointment
        });

    } catch (err: any) {
        return res.status(500).json({
            message: "Oops! Something went wrong",
            error: err.message
        });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const { clinicId, date } = req.query;

        if (!clinicId || typeof clinicId !== "string") {
            return res.status(400).json({ message: "clinicId is required" });
        }

        let sessionFilter: any = { clinicId };

        if (date) {
            const selected = date === "today" ? new Date() : new Date(date as string);

            const start = new Date(selected.setHours(0, 0, 0, 0));
            const end = new Date(selected.setHours(23, 59, 59, 999));

            sessionFilter.date = { $gte: start, $lte: end };
        }

        const sessions = await Session.find(sessionFilter).select("_id");

        const sessionIds = sessions.map(s => s._id);

        const appointments = await Appointment.find({
            sessionId: { $in: sessionIds }
        });

        return res.status(200).json({
            message: "Data fetched successfully!",
            appointments
        });

    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
};

export const getOne = async (req: Request, res: Response) => {
    try {
        const now = new Date();

        const userId = req.params.id;
        if (!userId || Array.isArray(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const appointment = await Appointment.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "sessions",
                    localField: "sessionId",
                    foreignField: "_id",
                    as: "session"
                }
            },
            { $unwind: "$session" },
            {
                $match: {
                    "session.startDateTime": { $gte: now }
                }
            },
            { $sort: { "session.startDateTime": 1 } },
            { $limit: 1 },
            {
                $lookup: {
                    from: "users",
                    localField: "doctorId",
                    foreignField: "_id",
                    as: "doctor"
                }
            },
            { $unwind: "$doctor" },
            {
                $lookup: {
                    from: "doctors",
                    localField: "doctorId",
                    foreignField: "userId",
                    as: "specialization"
                }
            },
            { $unwind: "$specialization" },
            {
                $project: {
                    slotTime: 1,
                    status: 1,
                    start: "$session.startDateTime",
                    img: "$doctor.img",
                    firstName: "$doctor.firstName",
                    lastName: "$doctor.lastName",
                    dateTime: "$session.startDateTime",
                    specialization: "$specialization.specialization"
                }
            }
        ]);

        if (!appointment.length) {
            return res.status(404).json({ message: "No upcoming appointment found" });
        }

        return res.status(200).json({ appointment: appointment[0] });

    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
};

export const getMy = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        if (!userId || Array.isArray(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const user = await User.findById({ _id: userId });
        if (user?.role === "user") {
            const appointments = await Appointment.find({ userId: new mongoose.Types.ObjectId(userId) }).populate("clinicId", "clinicName").populate("doctorId", "firstName lastName img");

            return res.status(200).json({
                message: "Data fetched successfully!", total: appointments.length, appointments
            });
        } else if (user?.role === "doctor") {
            const docAppoiintment = await Appointment.find({ doctorId: new mongoose.Types.ObjectId(userId), status: { $in: ["approved", "completed"] } }).populate("userId", "firstName  lastName  birthDay");
            return res.status(200).json({
                message: "Data fetched successfully!", total: docAppoiintment.length, docAppoiintment
            });
        }

    } catch (err) {
        return res.status(500).json({
            message: "Oops! Something went wrong",
            err
        });
    }
};

export const deleteAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        await Appointment.findByIdAndDelete(appointment._id);

        await Session.findByIdAndUpdate(appointment.sessionId, {
            $inc: { bookedPatients: -1 }
        });

        return res.status(200).json({
            message: "Appointment deleted successfully",
            appointment
        });

    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
};

export const getDetails = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const appointment = await Appointment.findById(id)
            .populate("doctorId", "firstName lastName")
            .populate("clinicId", "clinicName")
            .populate("userId", "firstName lastName email mobileNumber address");

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        const history = await Treatment.find({
            userId: appointment.userId
        })
            .populate("doctorId", "firstName lastName img")
            .populate("appointmentId", "_id dateTime status")
            .populate("sessionId", "_id");
        return res.status(200).json({ message: "Data fetched successfully", appointment, history });
    } catch (err) {
        return res.status(200).json({ message: "Oops! something went wrong" });
    }
}

export const getClinicAppointment = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const isClinic = await Staff.findOne({ userId: id });

        if (!isClinic) {
            return res.status(404).json({ message: "Clinic not found for this user" });
        }

        const appointments = await Appointment.aggregate([
            {
                $match: {
                    clinicId: isClinic.clinic,
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },

            {
                $lookup: {
                    from: "users",
                    localField: "doctorId",
                    foreignField: "_id",
                    as: "doctorDetails"
                }
            },
            { $unwind: "$doctorDetails" },

            {
                $project: {
                    _id: 1,
                    dateTime: 1,
                    status: 1,
                    clinicId: 1,

                    userName: {
                        $concat: [
                            "$userDetails.firstName",
                            " ",
                            "$userDetails.lastName"
                        ]
                    },

                    doctorName: {
                        $concat: [
                            "$doctorDetails.firstName",
                            " ",
                            "$doctorDetails.lastName"
                        ]
                    }
                }
            }
        ]);

        return res.status(200).json(appointments);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Oops! something went wrong" });
    }
};

export const approveAppointment = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const approving = await Appointment.findByIdAndUpdate(
            id,
            { status: "approved" },
            { new: true }
        );
        if (!approving) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        return res.status(200).json({ message: "Your appointment was approved!" });
    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
}

export const cancelAppointment = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const approving = await Appointment.findByIdAndUpdate(
            id,
            { status: "canceled" },
            { new: true }
        );
        if (!approving) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        return res.status(200).json({ message: "Your appointment was cancelled!" });
    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
}

