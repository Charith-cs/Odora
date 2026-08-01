import { Request, Response } from "express";
import Staff from "../models/staff.model";
import mongoose from "mongoose";
import Clinic from "../models/clinic.model";
import User from "../models/user.model";

export const getClinicWithStaffId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!id || Array.isArray(id) || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const clinic = await Staff.findOne({ userId: id });
        return res.status(200).json(clinic);
    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
}

export const updateStaffImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { managementId, img } = req.body;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                message: "Invalid staff id."
            });
        }

        if (!img) { return res.status(400).json({message: "Image is required."});}

        const clinic = await Clinic.findOne({
            managementId
        });

        if (!clinic) {return res.status(404).json({ message: "Clinic not found."});}

        const staff = await Staff.findOne({
            userId: id,
            clinic: clinic._id
        });

        if (!staff) { return res.status(404).json({message: "Staff not found." });}

        const updatedStaff = await User.findByIdAndUpdate(
            staff._id,
            {
                img
            },
            {
                new: true
            }
        );
        return res.status(200).json({message: "Profile image updated successfully.", staff: updatedStaff});

    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong."});
    }
};