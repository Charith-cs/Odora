import { Request, Response } from "express";
import User from "../models/user.model";
import Doctor from "../models/doctor.model";
import Clinic from "../models/clinic.model";
import Session from "../models/session.model";

export const doctorDetails = async (req: Request, res: Response) => {
    try {
        const doctor = await User.findOne({ _id: req.params.id }).select("-password");
        if (!doctor) {
            const clinic = await Clinic.findOne({ _id: req.params.id }).populate("doctorList", "firstName  lastName");
            if (!clinic) { return res.status(404).json({ message: "Not found!" }) };
            return res.status(200).json({ clinic });
        } else {
            const doctorDetails = await Doctor.findOne({ userId: doctor._id });
            const clinicDetails = await Clinic.find({ doctorList: doctor._id });
            if (!clinicDetails) { return res.status(404).json({ message: "Didn't assign to a clinic" }) }
            let availableSessions = await Session.find({ doctorId: doctor._id }).sort({ startDateTime: 1 }).limit(4);
            if (!availableSessions) { return res.status(404).json({ availableSessions: "No Session Data Available" }) }
            return res.status(200).json({ doctor, doctorDetails, clinicDetails, availableSessions });
        }
    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
};

export const getDoctor = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const doctorFields = await Doctor.findOne({ userId: id });
        if (!doctorFields) { return res.status(404).json({ message: "Doctor not found!" }) };
        return res.status(200).json(doctorFields);
    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong", err });
    }
}

export const getDoctorSessionDetailsForWalkIn = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(403).json({ message: "Check your id status" });
        };
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const sessionDetails = await Session.find({
            doctorId: id,
            status: "active",
            startDateTime: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        })
        .populate("doctorId" , "firstName lastName")
        .populate("clinicId" , "clinicName")
        ;
        return res.status(200).json(sessionDetails);
    } catch (err) {
        return res.status(500).json({ message: "Oops! something went wrong" });
    }
}