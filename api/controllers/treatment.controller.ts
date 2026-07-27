import { Request, Response } from "express";
import Treatment from "../models/Treatment.model";
import Appointment from "../models/appointment.model";

export const createTreatmentByDoc = async (
    req: Request,
    res: Response
) => {
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
            return res.status(400).json({
                message: "No treatments added",
            });
        }

        const formattedTreatments = treatments.map(
            (t: { name: string; price: number }) => ({
                name: t.name,
                price: t.price,
            })
        );

        const existingTreatment = await Treatment.findOne({
            appointmentId,
        });

        let treatment;

        // Create new treatment document
        if (!existingTreatment) {

            treatment = await new Treatment({
                userId,
                appointmentId,
                sessionId,
                doctorId,
                treatments: formattedTreatments,
                specialNotes,
            }).save();

        }

        // Existing treatment document
        else {

            const mergedTreatments = [
                ...existingTreatment.treatments,
                ...formattedTreatments,
            ];

            treatment = await Treatment.findByIdAndUpdate(
                existingTreatment._id,
                {
                    $set: {
                        treatments: mergedTreatments,

                        // Preserve previous note if new note is empty
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

        }

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

        if (!updatedAppointment) {
            return res.status(404).json({
                message: "Appointment not found",
            });
        }

        return res.status(200).json({
            message: existingTreatment
                ? "Treatment updated successfully!"
                : "Treatment created successfully!",
            treatment,
            appointment: updatedAppointment,
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Oops! Something went wrong",
            error: err,
        });

    }
};