import { Request, Response } from "express"
import Clinic from "../models/clinic.model";
import { clinicModelType } from "../types/types";
import Staff from "../models/staff.model";
import Session from "../models/session.model";
import User from "../models/user.model";
import mongoose from "mongoose";


export const registerClinic = async (req: Request, res: Response) => {
    try {
        const clinicData: clinicModelType = {
            ...req.body,
            clinicName: req.body.clinicName.trim(),
            email: req.body.email.trim().toLowerCase(),
            address: req.body.address.trim(),
            mobileNumber: req.body.mobileNumber.trim(),
            desc: req.body.desc?.trim(),
            managementId: req.body.managementId
        };

        const existingAdminClinic = await Clinic.findOne({
            managementId: req.body.id
        });

        if (existingAdminClinic) { return res.status(409).json({ message: "You already have a clinic." }); }

        const existingClinic = await Clinic.findOne({
            $or: [
                { clinicName: clinicData.clinicName },
                { email: clinicData.email },
                { mobileNumber: clinicData.mobileNumber }
            ]
        });

        if (existingClinic) { return res.status(409).json({ message: "Clinic already exists." }) }

        const clinic = await Clinic.create(clinicData);
        return res.status(201).json({ message: "Clinic registered successfully.", clinic });

    } catch (error) {
        return res.status(500).json({ message: "Oops! Something went wrong." });
    }
};

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

export const updateClinic = async ( req: Request, res: Response) => {
    try {
        const  {id}  = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({message: "Invalid clinic ID."});
        }

        const clinic = await Clinic.findOne({
            _id: id,
            managementId: req.body.managementId
        });

        if (!clinic) {
            return res.status(404).json({message: "Clinic not found." });
        }

        const updateData = {
            clinicName: req.body.clinicName?.trim(),
            email: req.body.email?.trim().toLowerCase(),
            mobileNumber: req.body.mobileNumber?.trim(),
            address: req.body.address?.trim(),
            desc: req.body.desc?.trim(),
            img: req.body.img
        };

        const duplicateClinic = await Clinic.findOne({
            _id: { $ne: clinic._id },
            $or: [
                { clinicName: updateData.clinicName },
                { email: updateData.email },
                { mobileNumber: updateData.mobileNumber }
            ]
        });

        if (duplicateClinic) {
            return res.status(409).json({message: "Clinic name, email or mobile number already exists."});
        }

        const updatedClinic = await Clinic.findByIdAndUpdate(
            clinic._id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({ message: "Clinic updated successfully.",clinic: updatedClinic});

    } catch (error) {
        return res.status(500).json({error : error , message: "Oops! Something went wrong."});
    }
};

/* export const updateClinic = async (req: Request, res: Response) => {
    try {
        const clinic = await Clinic.findOne({ _id: req.params.id });
        if (!clinic) { return res.status(404).json({ message: "Please check your clinic status" }) }

        const clinicData: clinicModelType = req.body;
        const updatedClinic = await Clinic.findByIdAndUpdate(clinic._id, clinicData, { new: true, runValidators: true });
        return res.status(200).json({ message: "Updated successfully", updatedClinic });
    } catch (error) {
        return res.status(500).json({ message: "Oops! Something went wrong." })
    }
} */

/* export const deleteClinic = async (req: Request, res: Response) => {
    try {
        const clinic = await Clinic.findOne({ _id: req.params.id });
        if (!clinic) { return res.status(404).json({ message: "Please check your clinic status" }) }

        await Clinic.findByIdAndDelete(clinic._id);
        return res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Oops! Something went wrong." })
    }
} */

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

export const requestJoinClinic = async (req: any, res: any) => {
    try {
        const { clinicId } = req.params;
        const doctorId = req.user.id;

        const clinic = await Clinic.findById(clinicId);

        if (!clinic) {
            return res.status(404).json({ message: "Clinic not found." });
        }

        const alreadyMember = clinic.doctorList.some(
            (id: any) => id.toString() === doctorId
        );

        if (alreadyMember) {
            return res.status(400).json({ message: "You already belong to this clinic." });
        }

        const alreadyRequested = clinic.pendingDoctorRequests.some(
            (item: any) => item.doctorId.toString() === doctorId
        );

        if (alreadyRequested) {
            return res.status(400).json({ message: "You have already sent a request." });
        }

        clinic.pendingDoctorRequests.push({
            doctorId,
            requestedAt: new Date(),
            status: "pending"
        });
        await clinic.save();

        return res.status(200).json({ message: "Join request sent successfully." });

    } catch (err) {
        return res.status(500).json({ message: "Oops! something went wrong" });
    }
};

export const getMyPendingRequests = async (req: any, res: any) => {
    try {
        const clinic = await Clinic.findOne({
            managementId: req.params.id
        })
            .populate(
                "pendingDoctorRequests.doctorId",
                "firstName lastName email mobileNumber img"
            );
        if (!clinic) { return res.status(404).json({ message: "Clinic not found." }); }
        return res.status(200).json(clinic.pendingDoctorRequests);
    } catch (err) {

        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
};

export const approveDoctorRequest = async (req: any, res: any) => {
    try {
        const { doctorId } = req.params;

        const clinic = await Clinic.findOne({
            managementId: req.user.id
        });

        if (!clinic) { return res.status(404).json({ message: "Clinic not found." }); }

        const existingClinic = await Clinic.findOne({
            doctorList: doctorId,
            _id: { $ne: clinic._id }
        });

        if (existingClinic) {
            return res.status(400).json({ message: `Doctor is already assigned to ${existingClinic.clinicName}.` });
        }

        const request = clinic.pendingDoctorRequests?.find(
            (item: any) => item.doctorId.toString() === doctorId
        );

        if (!request) { return res.status(404).json({ message: "Request not found." }); }
        const alreadyAdded = clinic.doctorList.some((id: any) => id.toString() === doctorId);

        if (!alreadyAdded) {
            clinic.doctorList.push(doctorId);
        }

        clinic.pendingDoctorRequests = clinic.pendingDoctorRequests.filter(
            (item: any) => item.doctorId.toString() !== doctorId
        );
        await clinic.save();
        return res.status(200).json({ message: "Doctor request approved successfully." });
    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong." });
    }
};

export const rejectDoctorRequest = async (req: any, res: any) => {
    try {
        const { doctorId } = req.params;

        const clinic = await Clinic.findOne({
            managementId: req.user.id
        });

        if (!clinic) { return res.status(404).json({ message: "Clinic not found." }); }
        const request = clinic.pendingDoctorRequests?.find(
            (item: any) => item.doctorId.toString() === doctorId
        );
        if (!request) { return res.status(404).json({ message: "Request not found." }); }
        clinic.pendingDoctorRequests = clinic.pendingDoctorRequests.filter(
            (item: any) => item.doctorId.toString() !== doctorId
        );

        await clinic.save();
        return res.status(200).json({ message: "Doctor request rejected." });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const addDoctorToClinicList = async (req: Request, res: Response) => {
    try {
        const { id: doctorId } = req.params;
        if (!doctorId || Array.isArray(doctorId)) { return res.status(404).json({ message: "Check Id status" }); }

        const clinic = await Clinic.findOne({
            managementId: req.body.id
        });
        if (!clinic) { return res.status(404).json("Clinic not found. Please try again later") };

        const alreadyAdded = clinic.doctorList.some(
            (id: any) => id.toString() === doctorId
        );

        if (alreadyAdded) {
            return res.status(400).json({
                success: false,
                message: "Doctor is already assigned to this clinic."
            });
        }

        clinic.doctorList.push(new mongoose.Types.ObjectId(doctorId));
        await clinic.save();
        return res.status(200).json("Doctor added successfully");
    } catch (err) {
        return res.status(500).json("Oops! Something went Wrong");
    }
}

export const getClinicForAdmin = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Check your Id status" });
        }
        const clinicDetails = await Clinic.findOne({
            managementId: id
        });
        if (!clinicDetails) {
            return res.status(404).json({ message: "Not found" });
        }
        const staffCount = await Staff.countDocuments({
            clinic: clinicDetails._id
        });
        return res.status(200).json({ clinicDetails, staffCount });
    } catch (err) {
        return res.status(500).json({ error: err, message: "Oops! Something went wrong" });
    }
}