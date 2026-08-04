import { Request, Response } from "express";
import Treatment from "../models/Treatment.model";
import Appointment from "../models/appointment.model";


export const createTreatmentByDoc = async (req: Request, res: Response) => {
    try {
        const {
            userId,
            appointmentId,
            sessionId,
            doctorId,
            treatments,
            specialNotes,
        } = req.body;

        if (!treatments || treatments.length === 0) {
            return res.status(400).json({ message: "No treatments added" });
        }

        const appointment = await Appointment.findById(
            appointmentId
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const existingTreatment = await Treatment.findOne({
            appointmentId,
        });

        if (existingTreatment) {
            return res.status(409).json({ message: "Treatment already exists for this appointment" });
        }

        const formattedTreatments = treatments.map(
            (t: { name: string; price: number }) => ({
                name: t.name,
                price: t.price,
            })
        );

        const treatment = await Treatment.create({
            userId,
            appointmentId,
            sessionId,
            doctorId,
            treatments: formattedTreatments,
            specialNotes,
        });

        const updatedAppointment =
            await Appointment.findByIdAndUpdate(
                appointmentId,
                {
                    status: "completed",
                },
                {
                    returnDocument: "after",
                }
            );

        return res.status(201).json({ message: "Treatment created successfully!", treatment, appointment: updatedAppointment, });

    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong", error: err, });
    }
};

export const updateTreatmentByDoc = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const {
            treatments,
            specialNotes,
        } = req.body;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                message: "Invalid treatment ID",
            });
        }

        if (!treatments || treatments.length === 0) {
            return res.status(400).json({
                message: "No treatments added",
            });
        }

        const existingTreatment =
            await Treatment.findById(id);

        if (!existingTreatment) {
            return res.status(404).json({
                message: "Treatment not found",
            });
        }

        const formattedTreatments = treatments.map(
            (t: { name: string; price: number }) => ({
                name: t.name,
                price: t.price,
            })
        );

        const mergedTreatments = [
            ...existingTreatment.treatments,
            ...formattedTreatments,
        ];

        const treatment = await Treatment.findByIdAndUpdate(
            id,
            {
                $set: {
                    treatments: mergedTreatments,

                    specialNotes:
                        specialNotes?.trim()
                            ? specialNotes
                            : existingTreatment.specialNotes,
                },
            },
            {
                returnDocument: "after",
            }
        );

        const updatedAppointment =
            await Appointment.findByIdAndUpdate(
                existingTreatment.appointmentId,
                {
                    status: "completed",
                },
                {
                    returnDocument: "after",
                }
            );


        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        return res.status(200).json({ message: "Treatment updated successfully!", treatment, appointment: updatedAppointment });

    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong", error: err });
    }
};