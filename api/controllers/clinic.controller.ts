import { Request, Response } from "express"
import Clinic from "../models/clinic.model";
import { clinicModelType } from "../types/types";
import Staff from "../models/staff.model";
import Session from "../models/session.model";
import User from "../models/user.model";


export const registerClinic = async (req: Request, res: Response) => {
    try {
        const clinicData: clinicModelType = req.body;
        const existingClinic = await Clinic.findOne({
            $or: [{ email: clinicData.email }, { clinicName: clinicData.clinicName }]
        });
        if (existingClinic) {
            return res.status(400).json({ message: "Clinic already registed" })
        }
        const newClinic = new Clinic(clinicData);
        const savedClinic = await newClinic.save();
        return res.status(201).json({ message: "Clinic registed successfully", savedClinic });
    } catch (error) {
        return res.status(500).json({ message: "Oops! Something went wrong.", error })
    }
}

export const getClinic = async (req: Request, res: Response) => {
    try {
        let clinic;
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(404).json("Check Id status!");
        }
        clinic = await Clinic.findOne({ _id: id });
        if (!clinic) {
            clinic = await Clinic.findOne({
                name: {
                    $regex: new RegExp(`^${id.trim()}$`, "i")
                }
            });
        }
        if (!clinic) { res.status(404).json({ message: " Clinic Details Unavilable" }) }
        return res.status(200).json({ message: "Getting relevant details..", clinic });
    } catch (error) {
        return res.status(500).json({ message: "Oops! Something went wrong." })
    }
}

export const getAllClinics = async (req: Request, res: Response) => {
    try {
        const clinics = await Clinic.find();
        if (clinics.length == 0) { return res.status(404).json({ message: "Clinic list is empty." }) }
        return res.status(200).json({ message: "Getting relevant details", clinics });
    } catch (error) {
        console.log("getAllClinics ERROR:", error);
        return res.status(500).json({ message: "Oops! Something went wrong.", error })
    }
}

export const updateClinic = async (req: Request, res: Response) => {
    try {
        const clinic = await Clinic.findOne({ _id: req.params.id });
        if (!clinic) { return res.status(404).json({ message: "Please check your clinic status" }) }

        const clinicData: clinicModelType = req.body;
        const updatedClinic = await Clinic.findByIdAndUpdate(clinic._id, clinicData, { new: true, runValidators: true });
        return res.status(200).json({ message: "Updated successfully", updatedClinic });
    } catch (error) {
        return res.status(500).json({ message: "Oops! Something went wrong." })
    }
}

export const deleteClinic = async (req: Request, res: Response) => {
    try {
        const clinic = await Clinic.findOne({ _id: req.params.id });
        if (!clinic) { return res.status(404).json({ message: "Please check your clinic status" }) }

        await Clinic.findByIdAndDelete(clinic._id);
        return res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Oops! Something went wrong." })
    }
}

export const addDoctors = async (req: Request, res: Response) => {
    try {
        const clinic = await Clinic.findById({ _id: req.params.id });
        if (!clinic) { return res.status(404).json({ message: "Please check your clinic status" }) }
        await Clinic.findByIdAndUpdate(
            clinic._id,
            {
                $push: { doctorList: req.body.doctorId }
            },
            {
                new: true,
                runValidators: true
            }
        );
        return res.status(200).json({ message: "Doctor added successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Oops! Something went wrong." })
    }
}

export const getRegisteredDoctors = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                message: "Check your ID status"
            });
        }

        const staff = await Staff.findOne({ userId: id });

        if (!staff) {
            return res.status(404).json({
                message: "Staff not found"
            });
        }

        if (!staff.clinic || Array.isArray(staff.clinic)) {
            return res.status(400).json({
                message: "Invalid clinic ID"
            });
        }

        const clinic = await Clinic.findById(staff.clinic);

        if (!clinic) {
            return res.status(404).json({
                message: "Clinic not found"
            });
        }

        const doctors = await Promise.all(
            clinic.doctorList.map(async (doctorId) => {
                const doctorDetails = await User.findById(doctorId);

                return {
                    id: doctorDetails?._id,
                    firstName: doctorDetails?.firstName,
                    lastName: doctorDetails?.lastName
                };
            })
        );

        return res.status(200).json({
            message: "Registered doctors fetched successfully",
            doctors
        });

    } catch (err) {
        return res.status(500).json({
            message: "Oops! Something went wrong",
            err
        });
    }
};
