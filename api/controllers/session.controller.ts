import { Request, Response } from "express";
import Session from "../models/session.model";
import SessionTemplate from "../models/sessionTemplate.model";
import mongoose from "mongoose";


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

        if (typeof id !== "string") {
            return res.status(400).json({ message: "Invalid doctor id" });
        }
        const cleanId = id.trim();
        if (!mongoose.Types.ObjectId.isValid(cleanId)) {
            return res.status(400).json({ message: "Invalid doctor id format" });
        }
        const sessions = await Session.find({
            doctorId: id,
            status: "active"
        })
            .populate("clinicId", "clinicName address")
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
            clinicId,
            startDate,
            endDate,
            startTime,
            endTime,
            daysOfWeek,
            maxPatients,
            maxPatientsPerHour,
            fee
        } = req.body;

        // ✅ VALIDATIONS (VERY IMPORTANT)
        if (!startTime || !endTime || !startTime.includes(":") || !endTime.includes(":")) {
            return res.status(400).json({
                message: "Invalid time format. Use HH:mm"
            });
        }

        if (!maxPatientsPerHour) {
            return res.status(400).json({
                message: "maxPatientsPerHour is required"
            });
        }

        // ✅ CREATE TEMPLATE
        const template = await SessionTemplate.create({
            doctorId,
            clinicId,
            startDate,
            endDate,
            startTime,
            endTime,
            daysOfWeek,
            maxPatients,
            maxPatientsPerHour,
            fee
        });

        // 🔥 GENERATE SESSIONS
        const sessions: any[] = [];

        let current = new Date(startDate);
        const end = new Date(endDate);

        while (current <= end) {

            const day = current.getDay();

            if (daysOfWeek.includes(day)) {

                const [sh, sm] = startTime.split(":").map(Number);
                const [eh, em] = endTime.split(":").map(Number);

                // ✅ SAFE DATE CREATION
                const startDT = new Date(current);
                startDT.setHours(sh, sm, 0, 0);

                const endDT = new Date(current);
                endDT.setHours(eh, em, 0, 0);

                // ❗ extra safety
                if (isNaN(startDT.getTime()) || isNaN(endDT.getTime())) {
                    return res.status(400).json({
                        message: "Invalid date or time values"
                    });
                }

                sessions.push({
                    doctorId,
                    clinicId,
                    templateId: template._id,
                    date: new Date(current),
                    startDateTime: startDT,
                    endDateTime: endDT,

                    maxPatients,
                    maxPatientsPerHour, // ✅ FIXED
                    bookedPatients: 0,

                    fee,
                    status: "active"
                });
            }

            // ✅ IMPORTANT: avoid mutation bug
            current = new Date(current);
            current.setDate(current.getDate() + 1);
        }

        // ✅ INSERT ONLY IF EXISTS
        if (sessions.length > 0) {
            await Session.insertMany(sessions);
        }

        return res.status(201).json({
            message: "Session template created & sessions generated",
            template,
            totalSessions: sessions.length
        });

    } catch (err: any) {
        return res.status(500).json({
            message: "Oops! Something went wrong",
            error: err.message
        });
    }
};

export const updateSessionTemplate = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const template = await SessionTemplate.findById(id);
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }

        // update template
        const updatedTemplate = await SessionTemplate.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        // 🔥 delete future sessions
        await Session.deleteMany({
            templateId: id as string,
            date: { $gte: new Date() }
        });

        // 👉 you can regenerate here again (same logic as create)

        return res.status(200).json({
            message: "Template updated (future sessions cleared)",
            updatedTemplate
        });

    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
};

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
