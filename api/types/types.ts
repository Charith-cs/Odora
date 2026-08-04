import { Types } from "mongoose";

/* user types */
export type userRole = "admin" | "staff" | "doctor" | "user";

/* user model types */
export type userModelType = {
    firstName: string,
    lastName: string,
    birthDay: string,
    email: string,
    img?: string,
    mobileNumber: string,
    gender: "male" | "female",
    address: string,
    password: string,
    role: userRole,
};

/* doctor model type */
export type doctorModelType = {
    userId: Types.ObjectId;
    university: string,
    slmcReg: string,
    degree: string,
    specialization: [string];
    experience: number;
    desc: string;
    consultationFee: number;
};

/* staff model types */
export type staffModelType = {
    userId: Types.ObjectId;
    clinic: Types.ObjectId;
}

/* appointment model types */
export type appointmentModelType = {
    userId: Types.ObjectId;
    doctorId: Types.ObjectId;
    clinicId: Types.ObjectId;
    sessionId: Types.ObjectId;
    dateTime: Date;
    fee: number;
    method: "visit" | "online";
    status: "pending" | "confirmed" | "cancelled" | "completed";
}

/* treatment model types */
export type treatmentModelType = {
    userId: Types.ObjectId;
    appointmentId: Types.ObjectId;
    sessionId: Types.ObjectId;
    doctorId: Types.ObjectId;
    treatments: {
        name: string,
        price: number,
    }[];
    specialNotes?: string;
}

/* billing model types */
export type billingModelType = {
    userId: Types.ObjectId;
    appointmentId: Types.ObjectId;
    clinicId: Types.ObjectId;
    doctorId: Types.ObjectId;
    treatmentId: Types.ObjectId;
    staffId: Types.ObjectId;
    status: "pending" | "paid";
    amount: number;
}

/* billing model types */
export type clinicModelType = {
    clinicName: string;
    address: string;
    email: string;
    img: string;
    desc: string;
    mobileNumber: string;
    managementId: Types.ObjectId;
    doctorList: [Types.ObjectId];
    pendingDoctorRequests: {
        doctorId: Types.ObjectId;
        requestedAt: Date;
        status : "pending" | "approved" | "rejected";
    }[];
}

/* message model types */
export type messageModelType = {
    userId: Types.ObjectId;
    clinicId: Types.ObjectId;
    appointmentId: Types.ObjectId;
    status: "Approved" | "Cancelled";
}

/* billing model types */
export type treatmentListModelType = {
    treatmentName: string;
    price: number;
}

/* doctor model type */
export type sessionModelType = {
    doctorId: Types.ObjectId,
    clinicId: Types.ObjectId,
    templateId: Types.ObjectId,
    date: Date,
    startDateTime: Date,
    endDateTime: Date,
    maxPatientsPerHour: number,
    bookedPatients: number,
    fee: number,
    status: "active" | "inactive" ,
};

export type sessionTemplayteModelType = {
    doctorId: Types.ObjectId,
    clinicId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
    startTime: string,
    endTime: string,
    daysOfWeek: [number],
    maxPatients: number,
    maxPatientsPerHour: number,
    fee: number,
    isActive: boolean
}
