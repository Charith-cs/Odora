import { Request, Response } from "express";
import Staff from "../models/staff.model";
import mongoose from "mongoose";

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