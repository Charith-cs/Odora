import mongoose, { Schema } from "mongoose";
import { messageModelType} from "../types/types";

const messageSchema = new Schema<messageModelType>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    clinicId: { 
        type: Schema.Types.ObjectId,
        ref: "Clinic",
        required: true
    },
    appointmentId: {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
        required: true
    },
    status:{
        type:String,
        enum:["Approved" , "Cancelled"],
    }
}, { timestamps: true });

export default mongoose.model<messageModelType>("Message", messageSchema);