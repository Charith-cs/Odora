import mongoose, { Schema } from "mongoose";
import { userModelType } from "../types/types";

const userSchema = new Schema<userModelType>({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    birthDay:{
        type:String,
        required:true
    },
    mobileNumber: {
        type: String,
        max: 10,
        min:0,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ["male","female"],
        required: true,
    },
    img:{
        type:String, 
    },
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        max:12,
        min:8,
        required: true,
    },
    role: {
        type: String,
        enum: ["user","staff","doctor"],
        required: true,
        default:"user"
    },
},{timestamps:true});

export default mongoose.model<userModelType>("User", userSchema);