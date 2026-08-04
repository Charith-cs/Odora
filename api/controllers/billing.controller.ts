import { Request, Response } from "express";
import Staff from "../models/staff.model";
import Appointment from "../models/appointment.model";
import Treatment from "../models/Treatment.model";
import Billing from "../models/billing.model";
import mongoose from "mongoose";

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
            staffId
        } = req.body;

        if (
            !appointmentId ||
            !userId ||
            !clinicId ||
            !doctorId ||
            amount === undefined ||
            amount === null ||
            !treatmentId ||
            !staffId
        ) {
            return res.status(400).json({ message: "Please add payment details!"});
        }

        if (Number(amount) < 0) {
            return res.status(400).json({message: "Invalid payment amount"});
        }

        const appointment = await Appointment.findById(
            appointmentId
        );

        if (!appointment) {
            return res.status(404).json({message: "Appointment not found"});
        }

        const existingPayment = await Billing.findOne({
            appointmentId
        });

        if (existingPayment) {
            return res.status(409).json({ message: "Payment already completed!"});
        }

        const treatment = await Treatment.findOne({
            _id: treatmentId,
            appointmentId
        });

        if (!treatment) {
            return res.status(400).json({ message: "Treatment does not belong to this appointment"});
        }

        const payment = await Billing.create({
            appointmentId,
            userId,
            clinicId,
            doctorId,
            amount,
            treatmentId,
            status: "paid",
            staffId
        });

        const updatedAppointment =
            await Appointment.findByIdAndUpdate(
                appointmentId,
                {
                    status: "paid"
                },
                {
                    new: true
                }
            );

        if (!updatedAppointment) {
            return res.status(404).json({message: "Appointment could not be updated"});
        }

        return res.status(201).json({ message: "Payment successful!",billId: payment._id});
    } catch (err: any) {
        return res.status(500).json({message: "Oops! Something went wrong",error: err.message});
    }
};

export const getInvoiceByBillingId = async (req: Request, res: Response) => {
    try {
        const billingId = req.params.id;
        if (!billingId || Array.isArray(billingId)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        if (!mongoose.Types.ObjectId.isValid(billingId)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const invoice = await Billing.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(billingId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "patient"
                }
            },
            { $unwind: "$patient" },
            {
                $lookup: {
                    from: "users",
                    localField: "doctorId",
                    foreignField: "_id",
                    as: "doctor"
                }
            }, { $unwind: "$doctor" },
            {
                $lookup: {
                    from: "clinics",
                    localField: "clinicId",
                    foreignField: "_id",
                    as: "clinic"
                }
            }, { $unwind: "$clinic" },
            {
                $lookup: {
                    from: "appointments",
                    localField: "appointmentId",
                    foreignField: "_id",
                    as: "appointment"
                }
            }, { $unwind: "$appointment" },
            {
                $lookup: {
                    from: "treatments",
                    localField: "treatmentId",
                    foreignField: "_id",
                    as: "treatment"
                }
            }, { $unwind: "$treatment" },
            {
                $lookup: {
                    from: "users",
                    localField: "staffId",
                    foreignField: "_id",
                    as: "staff"
                }
            }, { $unwind: { path: "$staff", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    billingId: "$_id",
                    amount: 1, status: 1,
                    createdAt: 1,
                    patient: {
                        id: "$patient._id",
                        name: { $concat: ["$patient.firstName", " ", "$patient.lastName"] },
                        address: "$patient.address",
                        mobile: "$patient.mobileNumber"
                    },
                    doctor: {
                        id: "$doctor._id",
                        name: { $concat: ["$doctor.firstName", " ", "$doctor.lastName"] }
                    },
                    clinic: {
                        id: "$clinic._id",
                        name: "$clinic.clinicName",
                        address: "$clinic.address",
                        mobile: "$clinic.mobileNumber"
                    },
                    appointment: {
                        id: "$appointment._id",
                        fee:"$appointment.fee",
                        dateTime: "$appointment.dateTime"
                    },
                    treatments: "$treatment.treatments",
                    specialNotes: "$treatment.specialNotes",
                    staff: {
                        id: "$staff._id",
                        name: { $concat: ["$staff.firstName", " ", "$staff.lastName"] }
                    }
                }
            }
        ]);
        /* 
                if (!invoice) {
                    return res.status(404).json({ message: "Invoice not found." });
                } */
        return res.status(200).json({ message: "Invoice retrieved successfully.", invoice });

    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong.", error: err });
    }

};