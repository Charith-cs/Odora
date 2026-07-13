import mongoose, { Schema } from "mongoose";
import { appointmentModelType } from "../types/types";

const appointmentModel = new Schema<appointmentModelType>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    doctorId: {
        type: Schema.Types.ObjectId,  
        ref: "User",
        required: true
    },
    clinicId: {
        type: Schema.Types.ObjectId,
        ref:"Clinic",
        required: true
    },
    sessionId:{
        type:Schema.Types.ObjectId,
        ref:"Session",
        required:true,
    },
    dateTime: {
        type: Date,  
        required: true
    },
    fee:{
        type:Number,
        required:true
    },
    method:{
        type:String,
        enum:["visit" , "online"],
        default:"visit"
    },
    status: {
        type: String,
        enum: ["pending", "approved", "cancelled" , "completed"],
        default: "pending"
    }
},{timestamps:true});

export default mongoose.model<appointmentModelType>("Appointment", appointmentModel);