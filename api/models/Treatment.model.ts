import mongoose, { Schema } from "mongoose";
import { treatmentModelType } from "../types/types";

const treatmentSchema = new Schema<treatmentModelType>({
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
    sessionId:{
        type:Schema.Types.ObjectId,
        ref:"Session",
        required:true
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    treatments: [
        {
            name: String,
            price: Number,
        },
    ],
    specialNotes: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model<treatmentModelType>("Treatment", treatmentSchema);