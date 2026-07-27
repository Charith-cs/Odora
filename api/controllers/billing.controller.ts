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
            status,
            staffId
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

        const existing = await Billing.findOne({
            appointmentId: appointmentId
        });
        if (existing) {
            return res.status(403).json({ message: "Payment already success!" });
        }

        const newPaymentDetails = new Billing({
            appointmentId,
            userId,
            clinicId,
            doctorId,
            amount,
            treatmentId,
            status,
            staffId
        });

        const response = await newPaymentDetails.save();
        if (!response._id) {
            return res.status(403).json("Oops! Something went wrong");
        }
        await Appointment.findByIdAndUpdate(
            appointmentId,
            { status: "paid" },
            { new: true }
        );

        return res.status(201).json({
            message: "Payment successful!",
            billId: response._id
        });

    } catch (err) {

        return res.status(500).json({
            message: "Oops! Something went wrong",
            error: err
        });
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