import mongoose, { Schema } from "mongoose";
import { treatmentListModelType } from "../types/types";

const treatmentListModel = new Schema<treatmentListModelType>({
    treatmentName: {
        type: String,
        require: true
    },
    price: {
        type: Number, 
        required: true
    },
}, { timestamps: true });

export default mongoose.model<treatmentListModelType>("TreatmentList", treatmentListModel);