import { Request, Response } from "express";
import Clinic from "../models/clinic.model";
import Doctor from "../models/doctor.model";

export const searchPosts = async (req: Request, res: Response) => {
    try {
        const query = (req.query.q as string)?.trim();
        if (!query) {
            return res.status(400).json({
                message: "Search query cannot be empty."
            });
        }

        if (query.toLowerCase() === "doctor") {

            const doctors = await Doctor.find()
                .populate({
                    path: "userId",
                    select: "-password"
                })
                .lean();
            return res.status(200).json({
                message: "Doctors fetched successfully.",
                totalDoctors: doctors.length,
                totalClinics: 0,
                doctors,
                clinics: []
            });
        }

        if (query.toLowerCase() === "clinic") {

            const clinics = await Clinic.find().lean();
            return res.status(200).json({
                message: "Clinics fetched successfully.",
                totalDoctors: 0,
                totalClinics: clinics.length,
                doctors: [],
                clinics
            });
        }

        if (query.toLowerCase() === "all") {
            const [doctors, clinics] = await Promise.all([
                Doctor.find()
                    .populate({
                        path: "userId",
                        select: "-password"
                    }).lean(),
                Clinic.find().lean()
            ]);
            return res.status(200).json({
                message: "Search results fetched successfully.",
                totalDoctors: doctors.length,
                totalClinics: clinics.length,
                doctors,
                clinics
            });
        }

        const words = query
            .split(/\s+/)
            .filter(Boolean);

        const doctorPipeline: any[] = [
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId"
                }
            },
            {
                $unwind: "$userId"
            },
            {
                $match: {
                    $and: words.map(word => {
                        const regex = new RegExp(word, "i");
                        return {
                            $or: [
                                { specialization: regex },
                                { degree: regex },
                                { university: regex },
                                { slmcReg: regex },
                                { desc: regex },
                                { "userId.firstName": regex },
                                { "userId.lastName": regex },
                                { "userId.address": regex },
                                { "userId.email": regex }
                            ]
                        };
                    })
                }
            },
            {
                $project: {
                    "userId.password": 0
                }
            }
        ];

        const clinicConditions = words.map(word => {
            const regex = new RegExp(word, "i");
            return {
                $or: [
                    { clinicName: regex },
                    { address: regex },
                    { desc: regex }
                ]
            };
        });

        const [doctors, clinics] = await Promise.all([
            Doctor.aggregate(doctorPipeline),
            Clinic.find({$and: clinicConditions}).lean()
        ]);

        return res.status(200).json({
            message: "Search results fetched successfully.",
            totalDoctors: doctors.length,
            totalClinics: clinics.length,
            doctors,
            clinics
        });
    } catch (err) {
        return res.status(500).json({message: "Search failed."});
    }
};