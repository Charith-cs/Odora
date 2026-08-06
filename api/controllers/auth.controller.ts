import User from "../models/user.model";
import Doctor from "../models/doctor.model";
import Staff from "../models/staff.model";
import bcrypt from "bcrypt";
import { generateToken } from "../utility/jwt";
import { Request, Response } from "express";
import { userModelType } from "../types/types";
import mongoose from "mongoose";
import Session from "../models/session.model";
import SessionTemplate from "../models/sessionTemplate.model";
import Appointment from "../models/appointment.model";
/* import authorizeRoles from "../middleware/role.middleware"; */


const SALT_ROUNDS = 12;
const ALLOWED_ROLES = ["user", "doctor", "staff",] as const;
type AllowedRole = typeof ALLOWED_ROLES[number];
const normalizeUserData = (data: userModelType): userModelType => {

    return {
        ...data,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        address: data.address.trim(),
        mobileNumber: data.mobileNumber.trim(),
        role: data.role.trim() as AllowedRole,
    };
};

export const userRegister = async (req: Request, res: Response) => {

    try {
        const userData = normalizeUserData(req.body as userModelType);
        if (!ALLOWED_ROLES.includes(userData.role as AllowedRole)) {
            return res.status(400).json({ field: "role", message: "Invalid user role." });
        }

        const requiredFields = ["firstName", "lastName", "email", "mobileNumber", "password", "birthDay", "gender", "address", "role"];

        for (const field of requiredFields) {
            if (!userData[field as keyof userModelType]) {
                return res.status(400).json({ field, message: `${field} is required.` });
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return res.status(400).json({ field: "email", message: "Invalid email format." });
        }

        if (!/^07\d{8}$/.test(userData.mobileNumber)) {
            return res.status(400).json({ field: "mobileNumber", message: "Invalid Sri Lankan mobile number." });
        }

        if (userData.password.length < 8) {
            return res.status(400).json({ field: "password", message: "Password must contain at least 8 characters." });
        }

        const birth = new Date(userData.birthDay);
        if (Number.isNaN(birth.getTime())) {
            return res.status(400).json({ field: "birthDay", message: "Invalid birth date." });
        }

        const today = new Date();
        if (birth > today) {
            return res.status(400).json({ field: "birthDay", message: "Birth date cannot be in the future." });
        }

        const age = Math.floor(
            (today.getTime() - birth.getTime()) /
            (365.25 * 24 * 60 * 60 * 1000)
        );

        if (age > 120) {
            return res.status(400).json({ field: "birthDay", message: "Invalid birth date." });
        }

        const existingUser = await User.findOne({
            $or: [{ email: userData.email }, { mobileNumber: userData.mobileNumber }]
        });

        if (existingUser) {
            if (existingUser.email === userData.email) {
                return res.status(409).json({ field: "email", message: "Email address is already registered." });
            }

            if (existingUser.mobileNumber === userData.mobileNumber) {
                return res.status(409).json({ field: "mobileNumber", message: "Mobile number is already registered." });
            }

            return res.status(409).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(
            userData.password,
            SALT_ROUNDS
        );

        const newUser = new User({
            ...userData,
            password: hashedPassword
        });

        const savedUsers = await newUser.save();
        const savedUser = Array.isArray(savedUsers)
            ? savedUsers[0]
            : savedUsers;

        if (!savedUser) { throw new Error("Failed to create user."); }


        if (userData.role === "doctor") {
            const {
                specialization,
                experience,
                consultationFee,
                university,
                slmcReg,
                degree,
                desc
            } = req.body;

            const doctorRequiredFields = [
                "specialization",
                "experience",
                "consultationFee"
            ];

            for (const field of doctorRequiredFields) {
                const value = req.body[field];
                if (value === undefined || value === null || value === "") {
                    return res.status(400).json({ field, message: `${field} is required.` });
                }
            }

            if (experience < 0) {
                return res.status(400).json({ field: "experience", message: "Experience cannot be negative." });
            }

            if (consultationFee <= 0) {
                return res.status(400).json({ field: "consultationFee", message: "Consultation fee must be greater than zero." });
            }

            try {
                const doctor = new Doctor({
                    userId: savedUser._id,

                    specialization: Array.isArray(specialization)
                        ? specialization.map((item: string) => item.trim())
                        : [specialization.trim()],

                    experience: Number(experience),
                    consultationFee: Number(consultationFee),
                    desc:desc?.trim(),

                    university: university?.trim(),
                    slmcReg: slmcReg?.trim(),
                    degree: degree?.trim()
                });

                await doctor.save();
            } catch (err: any) {
                return res.status(500).json({ error: err, message: "Oops! Something went wrong" });
            }
        }

        if (userData.role === "staff") {
            try {
                const { clinic } = req.body;
                if (clinic === undefined || clinic === null || clinic === "") {
                    return res.status(400).json({ field: "clinic", message: "Clinic is required." });
                }

                const staff = new Staff({
                    userId: savedUser._id,
                    clinic:
                        typeof clinic === "string" ? clinic.trim() : clinic
                });
                await staff.save();
            } catch (err: any) {
                return res.status(500).json({ error: err, message: "Oops! Something went wrong" });
            }
        }

        const token = generateToken(savedUser);
        const userObject = savedUser.toObject();
        delete userObject.password;
        return res.status(201).json({ message: "Successfully registered.", token, user: userObject });
    } catch (err: any) {
        return res.status(500).json({ error: err, message: "Oops! Something went wrong.Please try again later" });
    }
};

export const userLogin = async (req: Request, res: Response) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password;
        if (!email) {
            return res.status(400).json({ field: "email", message: "Email is required." });
        }

        if (!password) {
            return res.status(400).json({ field: "password", message: "Password is required." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ field: "email", message: "Invalid email format." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Please check your email and password." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Please check your email and password." });
        }

        const token = generateToken(user);
        const userObject = user.toObject();
        const { password: _, ...userWithoutPassword } = userObject;

        return res.status(200).json({ message: "Login successful.", token, user: userWithoutPassword });
    }
    catch (err) {
        return res.status(500).json({ error: err, message: "Oops! Something went wrong. Please try again later." });
    }
};

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
                desc
            } = req.body;


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
            if (desc !== undefined) doctorUpdateData.desc = desc;

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

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Check Id status" });
        }
        const userExistance = await User.findById(id);
        if (!userExistance) {
            return res.status(404).json({ message: "Not found" })
        }
        if (userExistance.role === "doctor") {

            const hasApprovedAppointments = await Appointment.exists({
                doctorId: id,
                status: "approved"
            });
            if (hasApprovedAppointments) {
                return res.status(409).json({ message: "You have approved appointments,Please contact the Clinic Management for better transition" });
            }
            await Promise.all([
                Appointment.deleteMany({
                    doctorId: id,
                    status: "pending"
                }),
                Session.deleteMany({ doctorId: id }),
                SessionTemplate.deleteMany({ doctorId: id }),
                Doctor.findOneAndDelete({ userId: id })
            ]);
            await User.findByIdAndDelete(id);

            return res.status(200).json({ message: "Your Profile has been deleted" });
        } else if (userExistance.role === "user") {

            const hasApprovedAppointments = await Appointment.exists({
                userId: id,
                status: "approved"
            });
            if (hasApprovedAppointments) {
                return res.status(409).json({ message: "You have approved appointments,Please contact the Clinic Management for better transition" });
            }
            await Promise.all([
                Appointment.deleteMany({
                    userId: id,
                    status: "pending"
                }),
                User.findByIdAndDelete(id)
            ]);
            return res.status(200).json({ message: "Your Profile has been deleted" });
        }
        return res.status(400).json({ message: "Unsupported user role." });

    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
}

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User account no longer exists" });
        }
        return res.status(200).json({ user });
    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
};

