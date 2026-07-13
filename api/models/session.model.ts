import mongoose, { Schema } from "mongoose";
import { sessionModelType } from "../types/types";

const sessionSchema = new Schema<sessionModelType>({
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    clinicId: {
        type: Schema.Types.ObjectId,
        ref: "Clinic",
        required: true,
    },
    templateId: {
        type: Schema.Types.ObjectId,
        ref: "SessionTemplate",
        required: true,
    },
    date: {
        type: Date,
        required: true,
        index: true, 
    },

    startDateTime: {
        type: Date,
        required: true,
    },
    endDateTime: {
        type: Date,
        required: true,
    },

    maxPatientsPerHour: {
        type: Number,
        required: true,
    },
    bookedPatients: {
        type: Number,
        default: 0,
    },

    fee: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: ["active", "cancelled", "completed"],
        default: "active",
    },
}, { timestamps: true });

export default mongoose.model<sessionModelType>("Session", sessionSchema);