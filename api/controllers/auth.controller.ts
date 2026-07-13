import User from "../models/user.model";
import Doctor from "../models/doctor.model";
import Staff from "../models/staff.model";
import bcrypt from "bcrypt";
import { generateToken } from "../utility/jwt";
import { Request, Response } from "express";
import { userModelType } from "../types/types";
import mongoose from "mongoose";
/* import authorizeRoles from "../middleware/role.middleware"; */


export const userRegister = async (req: Request, res: Response) => {
    try {
        const userData: userModelType = req.body;

        const allowedRoles = ["user", "doctor", "staff"];
        if (!allowedRoles.includes(userData.role)) {
            return res.status(400).json({ message: "Invalid role." });
        }

        const existingUser = await User.findOne({
            $or: [
                { email: userData.email },
                { mobileNumber: userData.mobileNumber }
            ]
        });

        if (existingUser) { return res.status(400).json({ message: "User already exists" }); }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = new User({
            ...userData,
            password: hashedPassword
        });
        const savedUser = await newUser.save();


        if (userData.role === "doctor") {
            const { specialization, experience, consultationFee, university, slmcReg, degree } = req.body;
            if (!specialization || !experience || !consultationFee) { throw new Error("Doctor fields missing"); }

            const doctor = new Doctor({
                userId: savedUser._id,
                specialization,
                experience,
                consultationFee,
                university,
                slmcReg,
                degree
            });
            await doctor.save();
        }

        if (userData.role === "staff") {
            const { clinic } = req.body;
            if (!clinic) { throw new Error("Clinic is required for staff"); }

            const staff = new Staff({ userId: savedUser._id, clinic });
            await staff.save();
        }

        const userObj = savedUser.toObject();
        const { password, ...userWithoutPassword } = userObj;
        const token = generateToken(savedUser);
        res.status(201).json({ message: "Successfully Registered", token, user: userWithoutPassword });

    } catch (error: any) {
        res.status(500).json({ message: "Oops! Something went wrong.", error: error.message });
    }
};

export const userLogin = async (req: Request, res: Response,) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Please check your email and password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Please check your email and password" });
        }
        const userObj = user.toObject();
        const { password: _, ...userWithoutPassword } = userObj;
        const token = generateToken(user);
        res.status(200).json({ message: "Login Successfully!", token, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: "Oops! Something went wrong.", err: error });
    }
}

export const userUpdate = async (req: Request, res: Response) => {
    try {
        const existingUser = await User.findById(req.params.id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const userData: userModelType = req.body;

        const allowedRoles = ["user", "doctor"];
        if (!allowedRoles.includes(userData.role)) {
            return res.status(400).json({ message: "Invalid role." });
        }

        let updatedData: any = { ...userData };

        if (userData.password) {
            updatedData.password = await bcrypt.hash(userData.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User update failed" });
        }

        // Doctor update
        if (userData.role === "doctor") {
            const {
                specialization,
                experience,
                consultationFee,
                university,
                slmcReg,
                degree,
            } = req.body;

            /*             if (!specialization || !experience || !consultationFee) {
                            throw new Error("Doctor fields missing");
                        } */

            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                return res.status(400).json({ message: "Invalid user id" });
            }
            const userObjectId = new mongoose.Types.ObjectId(id);
            const doctorUpdateData: any = {};

            if (specialization !== undefined) doctorUpdateData.specialization = specialization;
            if (experience !== undefined) doctorUpdateData.experience = experience;
            if (consultationFee !== undefined) doctorUpdateData.consultationFee = consultationFee;
            if (university !== undefined) doctorUpdateData.university = university;
            if (slmcReg !== undefined) doctorUpdateData.slmcReg = slmcReg;
            if (degree !== undefined) doctorUpdateData.degree = degree;

            await Doctor.findOneAndUpdate(
                { userId: userObjectId },
                doctorUpdateData,
                { new: true, upsert: true }
            );
        }

        const userObj = updatedUser.toObject();
        const { password, ...userWithoutPassword } = userObj;

        res.status(200).json({
            message: "User updated successfully",
            user: userWithoutPassword,
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Oops! Something went wrong.",
            error: error.message,
        });
    }
};

