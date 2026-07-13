import mongoose , {Schema} from "mongoose";
import { staffModelType } from "../types/types";

const staffModel = new Schema<staffModelType>({
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true,
            unique:true
        },
        clinic:{
            type:Schema.Types.ObjectId,
            ref:"Clinic",
            required:true 
        }
},{timestamps:true});

export default mongoose.model<staffModelType>("Staff" , staffModel);