import mongoose,{Schema} from "mongoose";
import { clinicModelType } from "../types/types";

const clinicModel = new Schema<clinicModelType>({
    clinicName:{
        type:String,
        require:true,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    email:{ 
        type:String,
        required:true,
        unique:true
    },
    img:{
        type:String,
    },
    desc:{
        type:String,
    },
    mobileNumber:{
        type:String,
        min:0,
        max:10,
        required:true,
        unique:true
    },
    doctorList:{
        type:[Schema.Types.ObjectId],
        ref:"User",
        default:[]
    },
    managementId : {
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});

export default mongoose.model<clinicModelType>("Clinic" , clinicModel);