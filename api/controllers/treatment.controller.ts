import { Request, Response } from "express";
import Treatment from "../models/Treatment.model";
import Appointment from "../models/appointment.model";

export const createTreatmentByDoc = async (req: Request, res: Response) => {
    try {

        if (!req.body.treatments || req.body.treatments.length === 0) {
            return res.status(400).json({ message: "No treatments added" });
        }

        const formattedTreatments = req.body.treatments.map(
            (t: { name: string; price: number }) => ({
                name: t.name,
                price: t.price
            })
        );

        const existingAppointment = await Treatment.findOne({
            appointmentId: req.body.appointmentId
        });

        if (!existingAppointment) {

            const newTreatment = new Treatment({
                userId: req.body.userId,
                appointmentId: req.body.appointmentId,
                sessionId: req.body.sessionId,
                doctorId: req.body.doctorId,
                treatments: formattedTreatments,
                specialNotes: req.body?.specialNotes,
            });

            const savedTreatment = await newTreatment.save();

            await Appointment.findByIdAndUpdate(
                req.body.appointmentId,
                { status: "completed" },
                { new: true }
            );

            return res.status(200).json({
                message: "Treatment details created successfully!",
                data: savedTreatment
            });
        }

        // 🟡 UPDATE EXISTING
        const updatedTreatment = await Treatment.findByIdAndUpdate(
            existingAppointment._id,
            {
                $set: {
                    treatments: formattedTreatments,
                    specialNotes: req.body?.specialNotes
                }
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Treatment updated successfully!",
            data: updatedTreatment
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
};