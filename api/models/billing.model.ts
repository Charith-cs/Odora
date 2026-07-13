import mongoose, { Schema } from "mongoose";
import { billingModelType } from "../types/types";

const billingSchema = new Schema<billingModelType>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    appointmentId: {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
        required: true
    },
    clinicId: {
        type: Schema.Types.ObjectId,
        ref: "Clinic",
        required: true
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    treatmentId: {
        type: Schema.Types.ObjectId,
        ref: "Treatment",
        required: true
    },
    staffId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending"
    },
    amount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export default mongoose.model<billingModelType>("Billing", billingSchema);