import { Request, Response } from "express";
import Staff from "../models/staff.model";
import Appointment from "../models/appointment.model";
import Treatment from "../models/Treatment.model";
import Billing from "../models/billing.model";

export const getCompleted = async (req: Request, res: Response) => {
    try {

        const startOfTheDay = new Date();
        startOfTheDay.setHours(0, 0, 0, 0);

        const endOfTheDay = new Date();
        endOfTheDay.setHours(23, 59, 59, 999);

        const id = req.params.id;

        if (!id || Array.isArray(id)) {
            return res.status(404).json({
                message: "Check Id status"
            });
        }

        const checkStaff = await Staff.findOne({
            userId: id
        });

        if (!checkStaff) {
            return res.status(404).json({
                message: "Not found"
            });
        }

        const todayCompleted = await Appointment.find({
            clinicId: checkStaff.clinic,
            status: ["completed", "paid"],
            dateTime: {
                $gte: startOfTheDay,
                $lte: endOfTheDay
            }
        })
            .populate("userId", "firstName lastName")
            .populate("doctorId", "firstName lastName");

        const completedWithTreatements = await Promise.all(
            todayCompleted.map(async (appointment) => {

                const treatmentDetails = await Treatment.findOne({
                    appointmentId: appointment._id
                });

                return {
                    ...appointment.toObject(),
                    treatmentDetails
                };
            })
        );

        return res.status(200).json(completedWithTreatements);

    } catch (err) {
        return res.status(500).json({
            message: "Oops! Something went wrong",
            err
        });
    }
};

export const createPayment = async (req: Request, res: Response) => {
    try {

        const {
            appointmentId,
            userId,
            clinicId,
            doctorId,
            amount,
            treatmentId,
            status,
            createdBy
        } = req.body;

        if (
            !appointmentId ||
            !userId ||
            !clinicId ||
            !doctorId ||
            !amount ||
            !treatmentId ||
            !status 
        ) {
            return res.status(400).json({
                message: "Please add treatment details!"
            });
        }

        const newPaymentDetails = new Billing({
            appointmentId,
            userId,
            clinicId,
            doctorId,
            amount,
            treatmentId,
            status,
        });

        await newPaymentDetails.save();
        await Appointment.findByIdAndUpdate(
            appointmentId,
            { status: "paid" },
            { new: true }
        );

        return res.status(201).json({
            message: "Payment successful!",
            billing: newPaymentDetails
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Oops! Something went wrong"
        });
    }
};