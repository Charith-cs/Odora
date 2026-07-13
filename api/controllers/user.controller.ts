import User from "../models/user.model";
import { Request, Response } from "express";
import { userModelType } from "../types/types";
import Appointment from "../models/appointment.model";
import Treatment from "../models/Treatment.model";
import mongoose from "mongoose";

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) { return res.status(404).json({ message: "Please check the user status" }) };
        return res.status(200).json({ message: "User details fetched successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Oops! Something went wrong." })
    }
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const user = await User.find();
        if (!user) { return res.status(404).json({ message: "User list is empty" }) };
        return res.status(200).json({ message: "User details fetched successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Oops! Something went wrong." })
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        if (!user) { return res.status(404).json({ message: "Please check the user status" }) };

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedUser) { return res.status(404).json({ message: "Please check the user status" }); }

        const userObj = updatedUser.toObject();
        const { password, ...userWithoutPassword } = userObj;

        return res.status(200).json({ message: "User details updated successfully", user: userWithoutPassword });

    } catch (error) {
        return res.status(500).json({ message: "Oops! Something went wrong." });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        if (!user) { return res.status(404).json({ message: "Please check the user status" }) };

        const updatedUser = await User.findByIdAndDelete(user._id);
        return res.status(200).json({ message: "User deleted successfully", updatedUser });
    } catch (error) {
        return res.status(500).json({ message: "Oops! Something went wrong." })
    }
}

export const getUsersBasedOnDoctor = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!id || Array.isArray(id) || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const objectId = new mongoose.Types.ObjectId(id);

        const user = await User.findById(objectId);

        let matchCondition: any = {
            status: "completed"
        };

        let roleType: "doctor" | "staff" | "clinic" | null = null;

        if (user) {
            if (user.role === "doctor") {
                matchCondition.doctorId = objectId;
                roleType = "doctor";
            } else if (user.role === "staff") {
                matchCondition.clinicId = objectId;
                roleType = "staff";
            } else {
                return res.status(403).json({ message: "Unauthorized role" });
            }
        } else {
            matchCondition.clinicId = objectId;
            roleType = "clinic";
        }

        const usersDetails = await Appointment.aggregate([
            {
                $match: matchCondition
            },
            {
                $group: {
                    _id: "$userId",
                    totalCompleted: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $lookup: {
                    from: "appointments",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", "$$userId"] },
                                        { $eq: ["$status", "completed"] },

                                        ...(roleType === "doctor"
                                            ? [{ $eq: ["$doctorId", objectId] }]
                                            : []),

                                        ...(roleType === "staff" || roleType === "clinic"
                                            ? [{ $eq: ["$clinicId", objectId] }]
                                            : [])
                                    ]
                                }
                            }
                        },
                        { $sort: { dateTime: -1 } },
                        { $limit: 1 }
                    ],
                    as: "lastappointment"
                }
            },
            {
                $unwind: {
                    path: "$lastappointment",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    totalCompleted: 1,
                    firstName: "$userDetails.firstName",
                    lastName: "$userDetails.lastName",
                    address: "$userDetails.address",
                    lastVisitDate: "$lastappointment.dateTime"
                }
            }
        ]);

        return res.status(200).json({
            message: "Data fetched successfully",
            type: roleType,
            count: usersDetails.length,
            usersDetails
        });

    } catch (err) {
        console.error("Error:", err);

        return res.status(500).json({
            message: "Oops! Something went wrong",
            error: err instanceof Error ? err.message : err
        });
    }
};

export const getUserDetailsWithAppointment = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Invalid doctor ID" });
        }
        const userId = new mongoose.Types.ObjectId(id);


        const appointment = await Appointment.findOne({
            userId: userId
        })
            .sort({ createdAt: -1 })
            .populate("doctorId", "firstName lastName")
            .populate("clinicId", "clinicName")
            .populate("userId", "firstName lastName email mobileNumber address img");

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const history = await Treatment.find({
            userId: appointment.userId
        })
            .populate("doctorId", "firstName lastName")
            .populate("appointmentId", "_id dateTime status")
            .populate("sessionId", "_id");

        return res.status(200).json({
            message: "Data fetched successfully",
            appointment,
            history
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Oops! something went wrong" });
    }
};