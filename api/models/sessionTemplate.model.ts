import mongoose, { Schema } from "mongoose";
import { sessionTemplayteModelType } from "../types/types";

const sessionTemplateSchema = new Schema<sessionTemplayteModelType>({
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    clinicId: {
        type: Schema.Types.ObjectId,
        ref: "Clinic",
        required: true
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    daysOfWeek: {
        type: [Number],
        required: true,
        max: 6,
        min: 0
    },
    maxPatients: {
        type: Number,
        required: true,
    },
    maxPatientsPerHour: {
        type: Number,
        required: true,
    },

    fee: {
        type: Number,
        required: true,
    },

    isActive: {
        type: Boolean,
        default: true,
    },
},{timestamps : true});

export default mongoose.model<sessionTemplayteModelType>("SessionTemplate", sessionTemplateSchema);

