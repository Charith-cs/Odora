import { Request, Response } from "express";
import Clinic from "../models/clinic.model";
import User from "../models/user.model";
import Doctor from "../models/doctor.model";

export const searchPosts = async (req: Request, res: Response) => {
    try {
        const query = (req.query.q as string)?.trim();
        if (!query) { return res.status(404).json({ message: "Can't search with empty" }) };

        if (query === "doctor") {
            let doctors = await Doctor.find()
                .populate({
                    path: "userId",
                    select: "-password"
                })
                .lean();
            return res.status(200).json({
                totalDoctors: doctors.length,
                totalClinics: 0,
                doctors,

            });
        } else if (query === "clinic") {
            let clinics = await Clinic.find();
            return res.status(200).json({
                totalDoctors: 0,
                totalClinics: clinics.length,
                clinics
            });
        } else if (query === "all") {
            let doctors = await Doctor.find()
                .populate({
                    path: "userId",
                    select: "-password"
                })
                .lean();
            let clinics = await Clinic.find().limit(10);
            return res.status(200).json({
                message: "Search results fetched successfully",
                totalDoctors: doctors.length,
                totalClinics: clinics.length,
                doctors,
                clinics
            });
        } else {
            const words = query.split(" ").filter(Boolean);

            const conditions = words.map(word => ({
                $or: [
                    { firstName: new RegExp(word, "i") },
                    { lastName: new RegExp(word, "i") },
                    { specialization: new RegExp(word, "i") },
                    { address: new RegExp(word, "i") },
                    { name: new RegExp(word, "i") }
                ]
            }));

            let doctors = await Doctor.find()
                .populate({
                    path: "userId",
                    select: "-password"
                })
                .lean();
            let clinics = await Clinic.find({
                $and: conditions
            });

            return res.status(200).json({
                message: "Search results fetched successfully",
                totalDoctors: doctors.length,
                totalClinics: clinics.length,
                doctors,
                clinics
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Search failed" });
    }
};