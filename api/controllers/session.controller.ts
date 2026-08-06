import { Request, Response } from "express";
import Session from "../models/session.model";
import SessionTemplate from "../models/sessionTemplate.model";
import mongoose from "mongoose";
import Clinic from "../models/clinic.model";


export const getAllSessions = async (req: Request, res: Response) => {
    try {
        const sessions = await Session.find()
            .populate("clinicId", "clinicName address")
            .populate("doctorId", "firstName lastName");

        return res.status(200).json(sessions);

    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
};

export const getDoctorSessions = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const now = new Date();

        if (typeof id !== "string") {
            return res.status(400).json({ message: "Invalid doctor id" });
        }
        const cleanId = id.trim();
        if (!mongoose.Types.ObjectId.isValid(cleanId)) {
            return res.status(400).json({ message: "Invalid doctor id format" });
        }
        const sessions = await Session.find({
            doctorId: id,
            status: "active",
            startDateTime: { $gte: now }
        })
            .populate("clinicId", "clinicName address")
            .populate("doctorId", "firstName lastName img")
            .sort({ date: 1 });

        return res.status(200).json({
            message: "Sessions fetched successfully",
            sessions
        });

    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong", err });
    }
};

export const createSessionTemplate = async (req: Request, res: Response) => {
    try {
        const {
            doctorId,
            startDate,
            endDate,
            startTime,
            endTime,
            daysOfWeek,
            maxPatients,
            maxPatientsPerHour,
            fee,
        } = req.body;

        const clinic = await Clinic.findOne(
            { doctorList: doctorId },
            { _id: 1 }
        );

        if (!clinic) {
            return res.status(404).json({
                message: "Clinic not found",
            });
        }


        if (
            !doctorId ||
            !startDate ||
            !endDate ||
            !startTime ||
            !endTime
        ) {
            return res.status(400).json({
                message: "Please fill all required fields.",
            });
        }

        if (
            !Array.isArray(daysOfWeek) ||
            daysOfWeek.length === 0
        ) {
            return res.status(400).json({
                message: "Please select at least one day.",
            });
        }

        if (
            !startTime.includes(":") ||
            !endTime.includes(":")
        ) {
            return res.status(400).json({
                message: "Invalid time format. Use HH:mm",
            });
        }


        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                message: "Invalid date.",
            });
        }

        if (start < today) {
            return res.status(400).json({
                message: "Start date cannot be in the past.",
            });
        }

        if (end < start) {
            return res.status(400).json({
                message: "End date cannot be before the start date.",
            });
        }



        const [sh, sm] = startTime.split(":").map(Number);
        const [eh, em] = endTime.split(":").map(Number);

        const startMinutes = sh * 60 + sm;
        const endMinutes = eh * 60 + em;

        if (endMinutes <= startMinutes) {
            return res.status(400).json({
                message: "End time must be later than the start time.",
            });
        }


        const now = new Date();

        if (start.toDateString() === now.toDateString()) {
            const currentMinutes =
                now.getHours() * 60 + now.getMinutes();

            if (startMinutes <= currentMinutes) {
                return res.status(400).json({
                    message: "Start time cannot be in the past.",
                });
            }
        }


        if (
            Number(maxPatients) <= 0
        ) {
            return res.status(400).json({
                message: "Maximum patients must be greater than zero.",
            });
        }

        if (
            Number(maxPatientsPerHour) <= 0
        ) {
            return res.status(400).json({
                message:
                    "Maximum patients per hour must be greater than zero.",
            });
        }

        if (
            Number(maxPatientsPerHour) >
            Number(maxPatients)
        ) {
            return res.status(400).json({
                message:
                    "Maximum patients per hour cannot exceed maximum patients.",
            });
        }

        if (Number(fee) < 0) {
            return res.status(400).json({
                message: "Fee cannot be negative.",
            });
        }


        const template = await SessionTemplate.create({
            doctorId,
            clinicId: clinic._id,
            startDate,
            endDate,
            startTime,
            endTime,
            daysOfWeek,
            maxPatients,
            maxPatientsPerHour,
            fee,
        });


        const sessions: any[] = [];

        let current = new Date(startDate);
        const templateEnd = new Date(endDate);

        while (current <= templateEnd) {

            const day = current.getDay();

            if (daysOfWeek.includes(day)) {

                const startDT = new Date(current);
                startDT.setHours(sh, sm, 0, 0);

                const endDT = new Date(current);
                endDT.setHours(eh, em, 0, 0);

                if (
                    isNaN(startDT.getTime()) || isNaN(endDT.getTime())
                ) {
                    return res.status(400).json({
                        message: "Invalid date or time values.",
                    });
                }

                sessions.push({
                    doctorId,
                    clinicId: clinic._id,
                    templateId: template._id,

                    date: new Date(current),

                    startDateTime: startDT,
                    endDateTime: endDT,

                    maxPatients,
                    maxPatientsPerHour,
                    bookedPatients: 0,

                    fee,

                    status: "active",
                });
            }

            current = new Date(current);
            current.setDate(current.getDate() + 1);
        }

        if (sessions.length > 0) {
            await Session.insertMany(sessions);
        }

        return res.status(201).json({
            message: "Session template created & sessions generated.",
            template,
            totalSessions: sessions.length,
        });

    } catch (err: any) {

        return res.status(500).json({
            message: "Oops! Something went wrong.",
            error: err.message,
        });

    }
};

export const updateSessionTemplate = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const {
            doctorId,
            startDate,
            endDate,
            startTime,
            endTime,
            daysOfWeek,
            maxPatients,
            maxPatientsPerHour,
            fee,
        } = req.body;

        const template = await SessionTemplate.findById(id);

        if (!template) {
            return res.status(404).json({
                message: "Session template not found.",
            });
        }

        const clinic = await Clinic.findOne(
            { doctorList: doctorId },
            { _id: 1 }
        );

        if (!clinic) {
            return res.status(404).json({
                message: "Clinic not found.",
            });
        }


        if (
            !doctorId ||
            !startDate ||
            !endDate ||
            !startTime ||
            !endTime
        ) {
            return res.status(400).json({
                message: "Please fill all required fields.",
            });
        }

        if (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0) {
            return res.status(400).json({
                message: "Please select at least one day.",
            });
        }

        if (
            !startTime.includes(":") ||
            !endTime.includes(":")
        ) {
            return res.status(400).json({
                message: "Invalid time format. Use HH:mm",
            });
        }


        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                message: "Invalid date.",
            });
        }

        if (start < today) {
            return res.status(400).json({
                message: "Start date cannot be in the past.",
            });
        }

        if (end < start) {
            return res.status(400).json({
                message: "End date cannot be before the start date.",
            });
        }


        const [sh, sm] = startTime.split(":").map(Number);
        const [eh, em] = endTime.split(":").map(Number);

        const startMinutes = sh * 60 + sm;
        const endMinutes = eh * 60 + em;

        if (endMinutes <= startMinutes) {
            return res.status(400).json({
                message: "End time must be later than the start time.",
            });
        }

        const now = new Date();

        if (start.toDateString() === now.toDateString()) {

            const currentMinutes =
                now.getHours() * 60 + now.getMinutes();

            if (startMinutes <= currentMinutes) {
                return res.status(400).json({
                    message: "Start time cannot be in the past.",
                });
            }
        }

        if (Number(maxPatients) <= 0) {
            return res.status(400).json({
                message: "Maximum patients must be greater than zero.",
            });
        }

        if (Number(maxPatientsPerHour) <= 0) {
            return res.status(400).json({
                message: "Maximum patients per hour must be greater than zero.",
            });
        }

        if (Number(maxPatientsPerHour) > Number(maxPatients)) {
            return res.status(400).json({
                message: "Maximum patients per hour cannot exceed maximum patients.",
            });
        }

        if (Number(fee) < 0) {
            return res.status(400).json({
                message: "Fee cannot be negative.",
            });
        }

        const updatedTemplate = await SessionTemplate.findByIdAndUpdate(
            id,
            {
                doctorId,
                clinicId: clinic._id,
                startDate,
                endDate,
                startTime,
                endTime,
                daysOfWeek,
                maxPatients,
                maxPatientsPerHour,
                fee,
            },
            { new: true }
        );



        await Session.deleteMany({
            templateId: template._id,
            date: { $gte: new Date() },
        });


        const sessions: any[] = [];

        let current = new Date(startDate);
        const templateEnd = new Date(endDate);

        while (current <= templateEnd) {

            const day = current.getDay();

            if (daysOfWeek.includes(day)) {

                const startDT = new Date(current);
                startDT.setHours(sh, sm, 0, 0);

                const endDT = new Date(current);
                endDT.setHours(eh, em, 0, 0);

                if (
                    isNaN(startDT.getTime()) ||
                    isNaN(endDT.getTime())
                ) {
                    return res.status(400).json({
                        message: "Invalid date or time values.",
                    });
                }

                sessions.push({
                    doctorId,
                    clinicId: clinic._id,
                    templateId: updatedTemplate!._id,

                    date: new Date(current),

                    startDateTime: startDT,
                    endDateTime: endDT,

                    maxPatients,
                    maxPatientsPerHour,
                    bookedPatients: 0,

                    fee,

                    status: "active",
                });
            }

            current = new Date(current);
            current.setDate(current.getDate() + 1);
        }

        if (sessions.length > 0) {
            await Session.insertMany(sessions);
        }

        return res.status(200).json({
            message: "Session template updated successfully.",
            updatedTemplate,
            totalSessions: sessions.length,
        });

    } catch (err: any) {

        return res.status(500).json({
            message: "Oops! Something went wrong.",
            error: err.message,
        });

    }
};

export const getAllSessionTemplates = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Doctor id is required",
            });
        }
        const getSesssionTempdetails = await SessionTemplate.find({
            doctorId: id,
            isActive: true
        });
        if (getSesssionTempdetails.length === 0) {
            return res.status(404).json("No available session templates")
        }
        return res.status(200).json(getSesssionTempdetails);
    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
}

export const cancelSession = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const session = await Session.findByIdAndUpdate(
            id,
            { status: "cancelled" },
            { new: true }
        );

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        return res.status(200).json({
            message: "Session cancelled successfully",
            session
        });

    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
};
