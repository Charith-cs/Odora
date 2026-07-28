import { Request, Response } from "express";
import Clinic from "../models/clinic.model";
import Appointment from "../models/appointment.model";
import User from "../models/user.model";
import Billing from "../models/billing.model";
import Doctor from "../models/doctor.model";
import Staff from "../models/staff.model";
import SessionTemplate from "../models/sessionTemplate.model";
import Session from "../models/session.model";
import Treatment from "../models/Treatment.model";
import mongoose from "mongoose";



export const getUsers = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const role = req.query.role as string;
        if (!id || Array.isArray(id)) {
            return res.status(404).json({ message: "Check your ID status" });
        }

        const clinic = await Clinic.findOne({ managementId: id });
        if (!clinic) {
            return res.status(404).json({ message: "Clinic not found" });
        }
        if (role === "user") {
            const usersAppointments = await Appointment.find({
                clinicId: clinic._id,
                status: {
                    $in: ["approved", "paid", "completed"]
                }
            }).populate("userId", "firstName lastName birthDay mobileNumber address");

            const uniqueUsersMap = new Map();

            usersAppointments.forEach((appointment: any) => {
                if (appointment.userId) {
                    uniqueUsersMap.set(
                        appointment.userId._id.toString(),
                        appointment.userId
                    );
                }
            });

            const uniqueUsers = Array.from(uniqueUsersMap.values());

            return res.status(200).json(uniqueUsers);

        } else if (role === "doctor") {

            const doctorList = await Doctor.find({
                userId: {
                    $in: clinic.doctorList,
                },
            })
                .populate(
                    "userId",
                    "firstName lastName mobileNumber address email"
                )

            return res.status(200).json(doctorList);
        } else if (role === "staff") {

            const now = new Date();

            const startOfDay = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                0, 0, 0, 0
            );

            const endOfDay = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23, 59, 59, 999
            );

            const staffData = await Staff.find({
                clinic: clinic._id
            })
                .populate("userId", "firstName lastName mobileNumber")
                .populate("clinic", "clinicName _id");


            const billing = await Billing.aggregate([
                {
                    $match: {
                        clinicId: clinic._id,
                        status: "paid",
                        createdAt: {
                            $gte: startOfDay,
                            $lte: endOfDay,
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: { $toDouble: "$amount" } }
                    }
                }
            ]);

            const totalBilling = billing[0]?.totalAmount || 0;


            const response = staffData.map((staff: any) => ({
                details: staff.userId,
                staffName: `${staff?.userId?.firstName || ""} ${staff?.userId?.lastName || ""}`,
                clinicName: staff?.clinic?.clinicName || "",
                clinicId: staff?.clinic?._id || "",
                mobileNum: staff?.userId?.mobileNumber || "",
                createdAt: staff?.createdAt || staff?._id?.getTimestamp?.() || null,
                totalBilling,
            }));

            return res.status(200).json(response);
        }

    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong", err });
    }
};

export const ViewEditUserDetails = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const role = req.query.role;
        if (!id || Array.isArray(id)) {
            return res.status(404).json({ message: "Invalid Id status" });
        }

        if (role === "user") {
            const userDetails = await User.findById(id).select("-password");
            const appointmentDetails = await Billing.find({
                userId: id
            })
                .populate("doctorId", "firstName lastName")
                .populate("appointmentId", "dateTime")
                .populate("treatmentId", "treatments");

            return res.status(200).json({ userDetails, appointmentDetails });

        } else if (role === "doctor") {

            const doctorDetails = await Doctor.find({ userId: id })
                .populate("userId", "firstName lastName email mobileNumber img address birthDay gender");

            const appointmentDetails = await Billing.find({
                doctorId: id
            })
                .populate("userId", "firstName lastName img")
                .populate("treatmentId", "treatments")
                .populate("appointmentId", "dateTime");
            return res.status(200).json({ doctorDetails, appointmentDetails });

        } else if (role === "staff") {

            const staffDetails = await Staff.find({ userId: id })
                .populate("userId", "firstName lastName mobileNumber email address birthDay gender createdAt")
                .populate("clinic", "clinicName");

            const appointmentDetails = await Billing.find({
                staffId: id
            })
                .populate("appointmentId", "_id dateTime")
                .populate("doctorId", "firstName lastName")
                .populate("userId", "firstName lastName")
                .populate("treatmentId", "treatments");

            return res.status(200).json({ staffDetails, appointmentDetails });
        }

    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
}

export const updateUserByAdmin = async (req: Request, res: Response) => {
    try {

        const id = req.params.id;

        if (!id || Array.isArray(id)) {
            return res.status(404).json({
                message: "Oops! something went wrong"
            });
        }

        const userId = req.params.userId;

        if (!userId || Array.isArray(userId)) {
            return res.status(404).json({
                message: "Oops! something went wrong"
            });
        }

        const check = await User.findById(id);

        if (check?.role !== "admin") {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        const allowedFields = [
            "firstName",
            "lastName",
            "email",
            "mobileNumber",
            "address",
            "birthDay",
            "gender"
        ];

        const allowedDoctorFields = [
            "slmc",
            "university",
            "experience",
            "consultationFee",
            "specialization",
            "desc",
            "degree"
        ];

        const updateData: any = {};
        const updateDoctorData: any = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        allowedDoctorFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateDoctorData[field] = req.body[field];
            }
        });

        // field mapping
        if (updateDoctorData.slmc) {
            updateDoctorData.slmcReg = updateDoctorData.slmc;
            delete updateDoctorData.slmc;
        }

        // specialization string -> array
        if (updateDoctorData.specialization) {
            updateDoctorData.specialization =
                updateDoctorData.specialization
                    .split(",")
                    .map((s: string) => s.trim());
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select("-password");

        // doctor update
        if (updatedUser?.role === "doctor") {

            const doctor = await Doctor.findOne({
                userId
            });

            if (doctor) {

                await Doctor.findByIdAndUpdate(
                    doctor._id,
                    { $set: updateDoctorData },
                    { new: true }
                );
            }
        }

        return res.status(200).json(updatedUser);

    } catch (err) {

        return res.status(500).json({
            message: "Update failed"
        });
    }
};

export const removeDoctorFromClinic = async (req: Request, res: Response) => {
    try {
        const clinic = await Clinic.findOne({
            managementId: req.body.id,
        });

        if (!clinic) {
            return res.status(404).json({ message: "Clinic not found", });
        }

        const doctorId = req.params.id;

        if (!clinic.doctorList.includes(doctorId as any)) {
            return res.status(404).json({ message: "Doctor not found in your clinic" });
        }
        await Clinic.findByIdAndUpdate(clinic._id, {
            $pull: {
                doctorList: doctorId,
            },
        });
        return res.json({ message: "Doctor removed from clinic successfully.", });
    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong.", });
    }
};

export const removeStaffFromClinic = async (req: Request, res: Response) => {
    try {

        const staffId = req.params.id;
        if (!staffId || Array.isArray(staffId)) {
            return res.status(403).json({ message: "Check id status" });
        }

        const clinic = await Clinic.findOne({
            managementId: req.body.id,
        });

        if (!clinic) {
            return res.status(404).json({ message: "Clinic not found!" });
        }
        const existingStaff = await Staff.findOne({ userId: staffId });
        if (!existingStaff) {
            return res.status(404).json({ message: "Staff not found!" });
        }
        if (!existingStaff.clinic.equals(clinic._id)) {
            return res.status(403).json({ message: "This staff member does not belong to your clinic." });
        }
        await Staff.findOneAndDelete({
            userId: staffId,
        });
        await User.findByIdAndDelete(staffId);

        return res.json({ message: "Staff removed from clinic successfully." });
    } catch (err) {
        return res.status(500).json({
            message: "Oops! Something went wrong",
        });
    }
};

export const removeUserfromClinic = async (req: Request, res: Response) => {

    const session = await mongoose.startSession();

    try {
        const id = req.params.id;

        if (!id || Array.isArray(id)) { return res.status(403).json("Check your Id status"); }

        const clinic = await Clinic.findOne({
            managementId: req.body.id,
        });

        if (!clinic) { return res.status(404).json({ message: "Clinic not found!" }); }

        const existingUser = await Appointment.find({
            userId: id,
            clinicId: clinic._id
        });

        if (existingUser.length === 0) { return res.status(403).json({ message: "This user does not belong to your clinic." }); }

        session.startTransaction();
        /*         await Promise.all(
                    existingUser.map((item) =>
                        Treatment.deleteMany({
                            appointmentId: item._id,
                            userId: id,
                        })
                    )
                );
                await Billing.deleteMany({
                    userId: id,
                    clinicId: clinic._id
                });
                await Appointment.deleteMany({
                    userId: id,
                    clinicId: clinic._id
                });
                await Session.deleteMany({
                    userId: id,
                    clinicId: clinic._id
                }); */
        await Appointment.deleteMany({
            userId: id,
            clinicId: clinic._id,
            status: { $in: ["pending", "confirmed"] },
        });

        await session.commitTransaction();

        return res.status(200).json({ message: "User removed from clinic successfully.", });
    } catch (err) {
        await session.abortTransaction();
        return res.status(500).json({ message: "Oops! Something went wrong" });
    } finally {
        session.endSession();
    }
}