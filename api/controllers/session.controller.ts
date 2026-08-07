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

        if (
            !doctorId ||
            !startDate ||
            !endDate ||
            !startTime ||
            !endTime
        ) {
            return res.status(400).json({message: "Please fill all required fields." });
        }


        if (
            !Array.isArray(daysOfWeek) || daysOfWeek.length === 0
        ) {
            return res.status(400).json({ message: "Please select at least one day." });
        }

        const clinic = await Clinic.findOne(
            {
                doctorList: doctorId,
            },
            {
                _id: 1,
            }
        );


        if (!clinic) {
            return res.status(404).json({ message: "Clinic not found.",});
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);


        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);


        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);


        if (
            isNaN(start.getTime()) ||
            isNaN(end.getTime())
        ) {
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
                message:
                    "End date cannot be before the start date.",
            });
        }


        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (
            !timeRegex.test(startTime) ||!timeRegex.test(endTime)
        ) {
            return res.status(400).json({ message: "Invalid time format. Use HH:mm.",});
        }


        const [sh, sm] = startTime
            .split(":")
            .map(Number);

        const [eh, em] = endTime
            .split(":")
            .map(Number);


        const startMinutes =
            sh * 60 + sm;

        const endMinutes =
            eh * 60 + em;


        if (endMinutes <= startMinutes) {
            return res.status(400).json({
                message:"End time must be later than the start time." });
        }

        const now = new Date();

        if (
            start.toDateString() === now.toDateString()
        ) {
            const currentMinutes =
                now.getHours() * 60 + now.getMinutes();


            if (startMinutes <= currentMinutes) {
                return res.status(400).json({
                    message: "Start time cannot be in the past."});
            }
        }

        const maxPatientsNumber = Number(maxPatients);
        const maxPatientsPerHourNumber = Number(maxPatientsPerHour);
        const feeNumber = Number(fee);

        if (
            !Number.isFinite(maxPatientsNumber) || maxPatientsNumber <= 0
        ) {
            return res.status(400).json({ message:"Maximum patients must be greater than zero.",});
        }


        if (
            !Number.isFinite(maxPatientsPerHourNumber) || maxPatientsPerHourNumber <= 0
        ) {
            return res.status(400).json({message: "Maximum patients per hour must be greater than zero."});
        }


        if (
            maxPatientsPerHourNumber > maxPatientsNumber
        ) {
            return res.status(400).json({
                message: "Maximum patients per hour cannot exceed maximum patients."});
        }


        if (
            !Number.isFinite(feeNumber) || feeNumber < 0
        ) {
            return res.status(400).json({ message:"Fee must be a valid non-negative number."});
        }


        const validDays = daysOfWeek.every(
            (day: any) =>
                Number.isInteger(Number(day)) &&
                Number(day) >= 0 &&
                Number(day) <= 6
        );


        if (!validDays) {
            return res.status(400).json({
                message: "Invalid selected day.",
            });
        }

        const selectedDays = daysOfWeek.map(
            (day: any) => Number(day)
        );


        const sessionDates: {
            date: Date;
            startDateTime: Date;
            endDateTime: Date;
        }[] = [];

        let current = new Date(start);
        const templateEnd = new Date(end);

        while (current <= templateEnd) {

            const day = current.getDay();

            if (selectedDays.includes(day)) {

                const startDT =new Date(current);
                startDT.setHours(sh,sm, 0, 0);
                const endDT =new Date(current);
                endDT.setHours(eh,em, 0,0);

                if (
                    isNaN(startDT.getTime()) || isNaN(endDT.getTime())
                ) {
                    return res.status(400).json({message:"Invalid date or time values.",});
                }


                if (startDT <= now) {


                    if (
                        startDT.toDateString() ===
                        now.toDateString()
                    ) {
                        return res.status(400).json({
                            message:"One or more selected sessions would start in the past."});
                    }
                }


                sessionDates.push({
                    date: new Date(current),
                    startDateTime: startDT,
                    endDateTime: endDT,
                });
            }


            current = new Date(current);

            current.setDate(
                current.getDate() + 1
            );
        }

        if (sessionDates.length === 0) {
            return res.status(400).json({
                message:"No sessions can be generated for the selected date range and days."});
        }

        for (const proposedSession of sessionDates) {

            const overlappingSession =
                await Session.findOne({
                    doctorId,
                    status: "active",
                    startDateTime: {
                        $lt: proposedSession.endDateTime,
                    },
                    endDateTime: {
                        $gt: proposedSession.startDateTime,
                    },
                });

            if (overlappingSession) {

                const conflictDate = proposedSession.startDateTime.toLocaleDateString("en-LK");
                const conflictStart =proposedSession.startDateTime.toLocaleTimeString("en-LK",{ hour: "2-digit", minute: "2-digit",} );
                const conflictEnd = proposedSession.endDateTime.toLocaleTimeString("en-LK",{hour: "2-digit", minute: "2-digit",});

                return res.status(409).json({ message:`Session conflict detected on ${conflictDate} between ${conflictStart} and ${conflictEnd}.`,});
            }
        }

        const template =
            await SessionTemplate.create({
                doctorId,
                clinicId:  clinic._id,
                startDate: start,
                endDate: end,
                startTime,
                endTime,
                daysOfWeek: selectedDays,
                maxPatients: maxPatientsNumber,
                maxPatientsPerHour:  maxPatientsPerHourNumber,
                fee: feeNumber,
            });


        const sessions =
            sessionDates.map(
                (session) => ({
                    doctorId,
                    clinicId: clinic._id,
                    templateId: template._id,
                    date:  session.date,
                    startDateTime: session.startDateTime,
                    endDateTime: session.endDateTime,
                    maxPatients:  maxPatientsNumber,
                    maxPatientsPerHour: maxPatientsPerHourNumber,
                    bookedPatients: 0,
                    fee: feeNumber,
                    status: "active"
                })
            );

        try {
            await Session.insertMany(
                sessions
            );

        } catch (sessionError) {
            await SessionTemplate.findByIdAndDelete(
                template._id
            );

            throw sessionError;
        }

        return res.status(201).json({
            message:"Session template created and sessions generated successfully.",
            template,
            totalSessions: sessions.length,});

    } catch (err: any) {
        return res.status(500).json({ message: "Oops! Something went wrong.", merror: err.message });
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
