import mongoose, { Schema } from "mongoose";
import { doctorModelType } from "../types/types";

const doctorSchema = new Schema<doctorModelType>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    university: {
        type: String,
        required: true,
    },
    slmcReg: {
        type: String,
        required: true,
    },
    degree:{
        type:String,
        required:true
    },
    specialization: {
        type: [String],
        required: true,
    },
    experience: {
        type: Number,
        required: true,
    },
    desc:{
        type:String
    },
    consultationFee: {
        type: Number,
        required: true
    },

}, { timestamps: true });

export default mongoose.model<doctorModelType>("Doctor", doctorSchema);