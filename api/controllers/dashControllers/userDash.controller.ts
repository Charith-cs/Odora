import { Request, Response } from "express";
import User from "../../models/user.model";
import Appointment from "../../models/appointment.model";
import Session from "../../models/session.model";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Staff from "../../models/staff.model";
import Billing from "../../models/billing.model";
import Treatment from "../../models/Treatment.model";
import Clinic from "../../models/clinic.model";


export const getClinic = async (req:Request , res:Response) => {
    try{
        const id = req.params.id;
        if(!id || Array.isArray(id)){
            return res.status(400).json({message : "Check Id status"});
        }
        const isClinic = await Clinic.findOne({
                managementId : id
        });
        if(!isClinic){
            return res.status(403).json({message:"Not found"});
        }
        return res.status(200).json(isClinic._id);
    }catch(err){
        return res.status(500).json({message:"Oops! Something went wrong"});
    }
}

export const dashCard = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(403).json({ message: "Check user status" });
        }
        const user = await User.findById(id);

        switch (user?.role) {
            case "user": {
                const upcomming = await Appointment.countDocuments({
                    userId: user._id,
                    dateTime: { $gte: new Date() },
                    status: "approved"
                });
                const completed = await Appointment.countDocuments({
                    userId: user._id,
                    status: "completed"
                });
                const result = await Appointment.aggregate([
                    {
                        $match: {
                            userId: user._id,
                            status: "completed"
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalFee: { $sum: "$fee" }
                        }
                    }
                ]);
                const totalPayments = result[0]?.totalFee || 0;
                const nextAppointment = await Appointment.aggregate([
                    {
                        $match: {
                            userId: user._id,
                            status: "approved",
                            dateTime: { $gte: new Date() }
                        }
                    },
                    {
                        $sort: { dateTime: 1 }
                    },
                    {
                        $limit: 1
                    },
                    {
                        $project: {
                            _id: 0,
                            next: "$dateTime"
                        }
                    }
                ]);
                const nextDay = nextAppointment[0]?.next || null;
                return res.status(200).json({ upcomming, completed, totalPayments, nextDay });
            }
            case "doctor": {
                const now = new Date();

                const endOfDay = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    23, 59, 59, 999
                );

                const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

                const upcomming = await Appointment.countDocuments({
                    doctorId: user._id,
                    dateTime: { $gte: new Date(), $lte: endOfDay },
                    status: "approved"
                });
                const completed = await Appointment.countDocuments({
                    doctorId: user._id,
                    dateTime: { $gte: new Date(), $lte: endOfDay },
                    status: "completed"
                });
                const lastMonthPatients = await Appointment.countDocuments({
                    doctorId: user._id,
                    dateTime: { $gte: startOfLastMonth, $lte: endOfLastMonth },
                    status: "completed"
                });
                const todaySessions = await Session.countDocuments({
                    doctorId: user._id,
                    date: now
                });
                return res.status(200).json({ upcomming, completed, lastMonthPatients, todaySessions });
            }
            case "staff": {
                const now = new Date();
                const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
                const endOfDay = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    23, 59, 59, 999
                );
                const startOfDay = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    0, 0, 0, 0
                );

                const extClinic = await Staff.findOne({
                    userId: user._id
                });
                if (!extClinic) { return res.status(404).json({ message: "Not found!" }) };
                const pending = await Appointment.countDocuments({
                    clinicId: extClinic.clinic,
                    status: "pending"
                });

                const lastMonthCompleted = await Appointment.countDocuments({
                    clinicId: extClinic.clinic,
                    status: "completed",
                    dateTime: { $gte: startOfLastMonth, $lte: endOfLastMonth }
                });
                const todayTotal = await Appointment.countDocuments({
                    clinicId: extClinic.clinic,
                    status: "approved",
                    dateTime: { $gte: startOfDay, $lte: endOfDay }
                });
                const completedBills = await Billing.countDocuments({
                    clinicId: extClinic.clinic,
                    status: "paid",
                    createdAt: { $gte: startOfDay, $lte: endOfDay }
                });
                return res.status(200).json({ pending, lastMonthCompleted, todayTotal, completedBills });
            }
            case "admin": {
                const clinic = await Clinic.findOne({
                    managementId: id
                });
                if (!clinic) {
                    return;
                }

                const upcomming = await Appointment.countDocuments({
                    status: "approved",
                    clinicId: clinic._id
                });

                const completed = await Appointment.countDocuments({
                    status: "completed",
                    clinicId: clinic._id
                });

                const canceled = await Appointment.countDocuments({
                    status: "canceled",
                    clinicId: clinic._id
                });

                // TOTAL COMPLETED TREATMENT AMOUNT
                const completedAppointments = await Appointment.find({
                    status: "completed",
                    clinicId: clinic._id
                });

                const treatmentAmounts = await Promise.all(
                    completedAppointments.map(async (appointment) => {

                        const treatments = await Treatment.find({
                            appointmentId: appointment._id,
                            clinicId: clinic._id,
                        });

                        return treatments.reduce((sum, treatment) => {

                            const treatmentTotal = treatment.treatments.reduce(
                                (innerSum: number, item: any) =>
                                    innerSum + item.price,
                                0
                            );

                            return sum + treatmentTotal;

                        }, 0);
                    })
                );

                const totalAmount = treatmentAmounts.reduce(
                    (sum, amount) => sum + amount,
                    0
                );

                // TOTAL PAID BILLING AMOUNT
                const paidBills = await Billing.find({
                    status: "paid",
                    clinicId: clinic._id
                });

                const paidAmounts = await Promise.all(
                    paidBills.map(async (bill) => {

                        const paidTreatments = await Treatment.find({
                            appointmentId: bill.appointmentId,
                            clinicId: clinic._id
                        });

                        return paidTreatments.reduce((sum, treatment) => {

                            const paidTotal = treatment.treatments.reduce(
                                (innerSum: number, item: any) =>
                                    innerSum + item.price,
                                0
                            );

                            return sum + paidTotal;

                        }, 0);
                    })
                );

                const paidTotalAmount = paidAmounts.reduce(
                    (sum, amount) => sum + amount,
                    0
                );

                //registered Doctors
                const adminUser = await Clinic.findOne({
                    managementId: user._id
                });
                if (!adminUser) {
                    return res.status(404).json({ message: "Invalid user status" });
                }
                const registeredDoctors = adminUser?.doctorList.length;

                //lastMoonthrevenue
                const now = new Date();

                const startOfLastMonth = new Date(
                    now.getFullYear(),
                    now.getMonth() - 1,
                    1
                );

                const endOfLastMonth = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    0,
                    23,
                    59,
                    59,
                    999
                );
                const lastMonthRevenue = await Billing.aggregate([
                    {
                        $match: {
                            status: "paid",
                            createdAt: {
                                $gte: startOfLastMonth,
                                $lte: endOfLastMonth
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalRevenue: {
                                $sum: "$amount"
                            }
                        }
                    }
                ]);

                const revenueAmount = lastMonthRevenue[0]?.totalRevenue || 0;

                //registeredusers
                const getRegisteredUsers = await Appointment.distinct("userId", {
                    clinicId: clinic._id
                });

                const registeredUsers = getRegisteredUsers.length;

                return res.status(200).json({
                    upcomming,
                    completed,
                    canceled,
                    totalAmount,
                    paidTotalAmount,
                    registeredDoctors,
                    revenueAmount,
                    registeredUsers
                });
            }
        }
    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong", err });
    }
}

export const imgUpload = async (req: Request, res: Response) => {
    try {
        const file = (req as any).file;

        if (!file) {
            return res.status(500).json({ message: "No file upload!" });
        }
        const allowedTypes = [
            "image/jpeg",
            "image/png"
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({message: "Only JPG, JPEG and PNG images are allowed!"});
        }
        const imageUrl = `http://localhost:5000/upload/${file.filename}`;

        await User.findByIdAndUpdate(req.params.id, {
            img: imageUrl
        });

        res.status(200).json({ message: "Upload successful", imageUrl });

    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong"});
    }
}

export const imgRemove = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Check user status!" });
        }
        if (user.img) {
            const filePath = path.join(__dirname, "./public/upload", user.img);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        const data = await User.updateOne(
            { _id: user._id },
            { $unset: { img: "" } }
        );
        return res.status(200).json({ message: "Your profile picture was removed!", data });
    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
}

export const getChartDataForDocDash = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (typeof id !== "string") {
            return res.status(400).json({ message: "Invalid doctor id" });
        }

        const cleanId = id.trim();

        if (!mongoose.Types.ObjectId.isValid(cleanId)) {
            return res.status(400).json({ message: "Invalid doctor id format" });
        }

        const data = await Appointment.aggregate([
            {
                $match: {
                    doctorId: new mongoose.Types.ObjectId(cleanId),
                    status: "approved"
                }
            },
            {
                $group: {
                    _id: { $month: "$dateTime" },
                    patients: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const months = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];

        const chartData = months.map((m, index) => {
            const found = data.find(d => d._id === index + 1);
            return {
                month: m,
                patients: found ? found.patients : 0
            };
        });

        return res.status(200).json({
            chartData
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Oops! Something went wrong"
        });
    }
};

export const getChartDataForAdmin = async (req: Request, res: Response) => {
    try {

        const data = await Billing.aggregate([
            {
                $match: {
                    status: "paid"
                }
            },
            {
                $group: {
                    _id: {
                        $month: "$createdAt"
                    },
                    revenue: {
                        $sum: {
                            $toDouble: "$amount"
                        }
                    }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const months = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];

        const chartData = months.map((m, index) => {

            const found = data.find(
                d => d._id === index + 1
            );

            return {
                month: m,
                revenue: found ? found.revenue : 0
            };
        });

        return res.status(200).json({
            chartData
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Oops! Something went wrong"
        });
    }
};

export const getChartDataForDocStaff = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { filter = "Monthly", managementId } = req.query;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: "Check your ID status" });
        }
        if (!managementId || Array.isArray(managementId)) {
            return res.status(400).json({ message: "Management ID is required" });
        }

        const clinic = await Clinic.findOne({ managementId });

        if (!clinic) {
            return res.status(404).json({ message: "Clinic not found" });
        }

        const userDetails = await User.findById(id);

        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }

        const now = new Date();
        let matchStage: any = { status: "paid" };
        let groupId: any;
        let sortStage: any;

        if (userDetails.role === "doctor") {
            const clinicStatus = await Clinic.findOne({
                _id: clinic._id,
                doctorList: id
            });
            if (!clinicStatus) {
                return res.status(403).json({ message: "Check your clinic status" });
            }

            matchStage.doctorId = new mongoose.Types.ObjectId(id);
            matchStage.clinicId = clinic._id;

        } else if (userDetails.role === "staff") {

            const staffStatus = await Staff.findOne({
                userId: id,
                clinic: clinic._id
            });

            if (!staffStatus) {
                return res.status(403).json({
                    message: "Check your clinic status"
                });
            }

            matchStage.staffId = new mongoose.Types.ObjectId(id);
            matchStage.clinicId = clinic._id;

        } else {

            return res.status(403).json({
                message: "Invalid user role"
            });
        }

        if (filter === "Today") {

            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            matchStage.createdAt = {
                $gte: start,
                $lte: end
            };

            groupId = {
                hour: {
                    $hour: "$createdAt"
                }
            };

            sortStage = {
                "_id.hour": 1
            };
        }

        else if (filter === "Weekly") {

            const weekAgo = new Date();

            weekAgo.setDate(now.getDate() - 6);
            weekAgo.setHours(0, 0, 0, 0);

            matchStage.createdAt = {
                $gte: weekAgo
            };

            groupId = {
                day: {
                    $dayOfWeek: "$createdAt"
                }
            };
            sortStage = {
                "_id.day": 1
            };
        }
        else if (filter === "Monthly") {

            matchStage.createdAt = {
                $gte: new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    1
                )
            };

            groupId = {
                day: {
                    $dayOfMonth: "$createdAt"
                }
            };

            sortStage = {
                "_id.day": 1
            };
        }

        else {
            matchStage.createdAt = {
                $gte: new Date(
                    now.getFullYear(),
                    0,
                    1
                )
            };
            groupId = {
                month: {
                    $month: "$createdAt"
                }
            };
            sortStage = {
                "_id.month": 1
            };
        }

        const revenue = await Billing.aggregate([
            {
                $match: matchStage
            },
            {
                $group: {
                    _id: groupId,
                    revenue: {
                        $sum: "$amount"
                    }
                }
            },
            {
                $sort: sortStage
            }
        ]);

        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const days = [
            "SUN",
            "MON",
            "TUE",
            "WED",
            "THU",
            "FRI",
            "SAT"
        ];

        const revenueMap = new Map();
        revenue.forEach((item: any) => {

            let key: number;

            if (filter === "Today") {
                key = item._id.hour;
            } else if (filter === "Weekly") {
                key = item._id.day;
            } else if (filter === "Monthly") {
                key = item._id.day;
            } else {
                key = item._id.month;
            }

            revenueMap.set(key, item);
        });

        let formattedData: any[] = [];

        // TODAY
        if (filter === "Today") {
            for (let hour = 0; hour < 24; hour++) {
                const item = revenueMap.get(hour);
                formattedData.push({
                    label: `${hour}:00`,
                    revenue: item?.revenue ?? 0
                });
            }
        }

        // WEEKLY
        else if (filter === "Weekly") {
            for (let day = 1; day <= 7; day++) {
                const item = revenueMap.get(day);
                formattedData.push({
                    label: days[day - 1],
                    revenue: item?.revenue ?? 0
                });
            }
        }

        // MONTHLY
        else if (filter === "Monthly") {
            const lastDay = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0
            ).getDate();

            for (let day = 1; day <= lastDay; day++) {
                const item = revenueMap.get(day);
                formattedData.push({
                    label: day.toString(),
                    revenue: item?.revenue ?? 0
                });
            }
        }
        // YEARLY
        else {

            for (let month = 1; month <= 12; month++) {
                const item = revenueMap.get(month);
                formattedData.push({
                    label: months[month - 1],
                    revenue: item?.revenue ?? 0
                });
            }
        }

        return res.status(200).json(formattedData);

    } catch (err: any) {
        return res.status(500).json({ message: "Oops! Something went wrong.", error: err.message });
    }
};

export const reportDashCard = async (req: Request, res: Response) => {
    try {

        const id = req.params.id;
        const now = new Date();

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        if (!id || Array.isArray(id)) {
            return res.status(404).json({ message: "Check your Id status!" });
        }
        const clinic = await Clinic.findOne({
            managementId: id
        });
        if (!clinic) {
            return res.status(404).json({ message: "Clinic not available" });
        }

        const totalPatients = await Billing.countDocuments({
            clinicId: clinic._id,
            status: "paid"
        });
        const totalDoctors = clinic.doctorList?.length;
        const totalAppointments = await Appointment.countDocuments({
            clinicId: clinic._id,
            status: "completed"
        });
        const totalRevenue = await Billing.aggregate([
            {
                $match: {
                    clinicId: clinic._id,
                    status: "paid",
                    createdAt: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    revenue: {
                        $sum: { $toDouble: "$amount" }
                    }
                }
            }
        ]);
        const formattedRevenue = totalRevenue[0].revenue
        return res.status(200).json({ totalPatients, totalDoctors, totalAppointments, formattedRevenue });
    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
}

export const getAppointmentAnalytics = async (req: any, res: any) => {
    try {
        const { filter = "Monthly" } = req.query;

        const clinic = await Clinic.findOne({
            managementId: req.user.id,
        });

        if (!clinic) {
            return res.status(404).json({
                message: "Clinic not found!",
            });
        }

        const now = new Date();

        let matchStage: any = {
            clinicId: clinic._id,
        };

        let groupId: any;
        let sortStage: any;

        // TODAY
        if (filter === "Today") {

            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            matchStage.createdAt = {
                $gte: start,
                $lte: end,
            };

            groupId = {
                hour: {
                    $hour: "$createdAt",
                },
            };

            sortStage = {
                "_id.hour": 1,
            };
        }

        // WEEKLY
        else if (filter === "Weekly") {

            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 6);
            weekAgo.setHours(0, 0, 0, 0);

            matchStage.createdAt = {
                $gte: weekAgo,
            };

            groupId = {
                day: {
                    $dayOfWeek: "$createdAt",
                },
            };

            sortStage = {
                "_id.day": 1,
            };
        }

        // MONTHLY
        else if (filter === "Monthly") {

            matchStage.createdAt = {
                $gte: new Date(now.getFullYear(), now.getMonth(), 1),
            };

            groupId = {
                day: {
                    $dayOfMonth: "$createdAt",
                },
            };

            sortStage = {
                "_id.day": 1,
            };
        }

        // YEARLY
        else {

            matchStage.createdAt = {
                $gte: new Date(now.getFullYear(), 0, 1),
            };

            groupId = {
                month: {
                    $month: "$createdAt",
                },
            };

            sortStage = {
                "_id.month": 1,
            };
        }

        const analytics = await Appointment.aggregate([
            {
                $match: matchStage,
            },
            {
                $group: {
                    _id: groupId,

                    total: {
                        $sum: 1,
                    },

                    approved: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "approved"] },
                                1,
                                0,
                            ],
                        },
                    },

                    completed: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "completed"] },
                                1,
                                0,
                            ],
                        },
                    },

                    canceled: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "canceled"] },
                                1,
                                0,
                            ],
                        },
                    },

                    paid: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "paid"] },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
            {
                $sort: sortStage,
            },
        ]);

        const months = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];

        const days = [
            "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"
        ];

        // Convert aggregation result into a lookup map
        const analyticsMap = new Map();

        analytics.forEach((item: any) => {

            let key: number;

            if (filter === "Today") {
                key = item._id.hour;
            }

            else if (filter === "Weekly") {
                key = item._id.day;
            }

            else if (filter === "Monthly") {
                key = item._id.day;
            }

            else {
                key = item._id.month;
            }

            analyticsMap.set(key, item);
        });

        let formattedData: any[] = [];

        if (filter === "Today") {

            for (let hour = 0; hour < 24; hour++) {

                const item = analyticsMap.get(hour);

                formattedData.push({
                    label: `${hour}:00`,
                    total: item?.total ?? 0,
                    approved: item?.approved ?? 0,
                    completed: item?.completed ?? 0,
                    canceled: item?.canceled ?? 0,
                    paid: item?.paid ?? 0,
                });
            }
        }

        else if (filter === "Weekly") {

            for (let day = 1; day <= 7; day++) {

                const item = analyticsMap.get(day);

                formattedData.push({
                    label: days[day - 1],
                    total: item?.total ?? 0,
                    approved: item?.approved ?? 0,
                    completed: item?.completed ?? 0,
                    canceled: item?.canceled ?? 0,
                    paid: item?.paid ?? 0,
                });
            }
        }

        else if (filter === "Monthly") {

            const lastDay = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0
            ).getDate();

            for (let day = 1; day <= lastDay; day++) {

                const item = analyticsMap.get(day);

                formattedData.push({
                    label: day.toString(),
                    total: item?.total ?? 0,
                    approved: item?.approved ?? 0,
                    completed: item?.completed ?? 0,
                    canceled: item?.canceled ?? 0,
                    paid: item?.paid ?? 0,
                });
            }
        }

        else {

            for (let month = 1; month <= 12; month++) {

                const item = analyticsMap.get(month);

                formattedData.push({
                    label: months[month - 1],
                    total: item?.total ?? 0,
                    approved: item?.approved ?? 0,
                    completed: item?.completed ?? 0,
                    canceled: item?.canceled ?? 0,
                    paid: item?.paid ?? 0,
                });
            }
        }

        return res.status(200).json(formattedData);

    } catch (err: any) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
};

export const getRevenueTrend = async (req: any, res: any) => {
    try {

        const { filter = "Monthly" } = req.query;

        const clinic = await Clinic.findOne({
            managementId: req.user.id,
        });

        if (!clinic) {
            return res.status(404).json({
                message: "Clinic not found!",
            });
        }

        const now = new Date();

        let matchStage: any = {
            clinicId: clinic._id,
        };

        let groupId: any;
        let sortStage: any;

        // TODAY
        if (filter === "Today") {

            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            matchStage.createdAt = {
                $gte: start,
                $lte: end,
            };

            groupId = {
                hour: {
                    $hour: "$createdAt",
                },
            };

            sortStage = {
                "_id.hour": 1,
            };
        }

        // WEEKLY
        else if (filter === "Weekly") {

            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 6);
            weekAgo.setHours(0, 0, 0, 0);

            matchStage.createdAt = {
                $gte: weekAgo,
            };

            groupId = {
                day: {
                    $dayOfWeek: "$createdAt",
                },
            };

            sortStage = {
                "_id.day": 1,
            };
        }

        // MONTHLY
        else if (filter === "Monthly") {

            matchStage.createdAt = {
                $gte: new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    1
                ),
            };

            groupId = {
                day: {
                    $dayOfMonth: "$createdAt",
                },
            };

            sortStage = {
                "_id.day": 1,
            };
        }

        // YEARLY
        else {

            matchStage.createdAt = {
                $gte: new Date(
                    now.getFullYear(),
                    0,
                    1
                ),
            };

            groupId = {
                month: {
                    $month: "$createdAt",
                },
            };

            sortStage = {
                "_id.month": 1,
            };
        }

        const revenue = await Billing.aggregate([
            {
                $match: matchStage,
            },
            {
                $group: {
                    _id: groupId,
                    revenue: {
                        $sum: "$amount",
                    },
                },
            },
            {
                $sort: sortStage,
            },
        ]);

        const months = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];

        const days = [
            "SUN",
            "MON",
            "TUE",
            "WED",
            "THU",
            "FRI",
            "SAT"
        ];

        const revenueMap = new Map();

        revenue.forEach((item: any) => {

            let key: number;

            if (filter === "Today") {
                key = item._id.hour;
            }

            else if (filter === "Weekly") {
                key = item._id.day;
            }

            else if (filter === "Monthly") {
                key = item._id.day;
            }

            else {
                key = item._id.month;
            }

            revenueMap.set(key, item);
        });

        let formattedData: any[] = [];

        if (filter === "Today") {

            for (let hour = 0; hour < 24; hour++) {

                const item = revenueMap.get(hour);

                formattedData.push({
                    label: `${hour}:00`,
                    revenue: item?.revenue ?? 0,
                });
            }
        }

        else if (filter === "Weekly") {

            for (let day = 1; day <= 7; day++) {

                const item = revenueMap.get(day);

                formattedData.push({
                    label: days[day - 1],
                    revenue: item?.revenue ?? 0,
                });
            }
        }

        else if (filter === "Monthly") {

            const lastDay = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0
            ).getDate();

            for (let day = 1; day <= lastDay; day++) {

                const item = revenueMap.get(day);

                formattedData.push({
                    label: day.toString(),
                    revenue: item?.revenue ?? 0,
                });
            }
        }

        else {

            for (let month = 1; month <= 12; month++) {

                const item = revenueMap.get(month);

                formattedData.push({
                    label: months[month - 1],
                    revenue: item?.revenue ?? 0,
                });
            }
        }

        return res.status(200).json(formattedData);

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Oops! Something went wrong",
        });
    }
};

export const userPieChart = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!id || Array.isArray(id)) {
            return res.status(404).json({ message: "invalid Id status" });
        }

        const clinic = await Clinic.findOne({
            managementId: id
        });

        if (!clinic) {
            return res.status(403).json({ message: "Invalid Id status" });
        }

        const result = await Appointment.aggregate([
            {
                $match: {
                    clinicId: clinic._id,
                    status: "paid"
                }
            },
            {
                $group: {
                    _id: "$userId",
                    count: { $sum: 1 }
                }
            },

            // classify patients
            {
                $group: {
                    _id: null,
                    newPatients: {
                        $sum: {
                            $cond: [{ $eq: ["$count", 1] }, 1, 0]
                        }
                    },
                    returningPatients: {
                        $sum: {
                            $cond: [{ $gt: ["$count", 1] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        return res.status(200).json(
            result[0] || {
                newPatients: 0,
                returningPatients: 0
            }
        );

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
};


//report controllers

export const docPerformanceReport = async (req: any, res: any) => {
    try {

        const {
            filter = "Monthly",
            from,
            to
        } = req.query;

        const clinic = await Clinic.findOne({
            managementId: req.user.id
        });

        if (!clinic) {
            return res.status(404).json({
                message: "Clinic not found"
            });
        }

        let dateFilter: any = {};
        const now = new Date();

        // TODAY
        if (filter === "Today") {

            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };
        }

        // WEEKLY
        else if (filter === "Weekly") {

            const start = new Date();
            start.setDate(now.getDate() - 6);
            start.setHours(0, 0, 0, 0);

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: now
                }
            };
        }

        // MONTHLY
        else if (filter === "Monthly") {

            const start = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );

            const end = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0,
                23,
                59,
                59,
                999
            );

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };
        }

        // YEARLY
        else if (filter === "Yearly") {

            const start = new Date(
                now.getFullYear(),
                0,
                1
            );

            const end = new Date(
                now.getFullYear(),
                11,
                31,
                23,
                59,
                59,
                999
            );

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };
        }

        // CUSTOM RANGE
        if (from && to) {

            const fromDate = new Date(from as string);

            const toDate = new Date(to as string);
            toDate.setHours(23, 59, 59, 999);

            dateFilter = {
                createdAt: {
                    $gte: fromDate,
                    $lte: toDate
                }
            };
        }

        const doctorPerformance = await Billing.aggregate([

            {
                $match: {
                    clinicId: clinic._id,
                    status: "paid",
                    ...dateFilter
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "doctorId",
                    foreignField: "_id",
                    as: "doctor"
                }
            },

            {
                $unwind: {
                    path: "$doctor",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "doctors",
                    localField: "doctorId",
                    foreignField: "userId",
                    as: "docDetails"
                }
            },

            {
                $unwind: {
                    path: "$docDetails",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $group: {

                    _id: "$doctorId",

                    doctorName: {
                        $first: {
                            $trim: {
                                input: {
                                    $concat: [
                                        {
                                            $ifNull: [
                                                "$doctor.firstName",
                                                ""
                                            ]
                                        },
                                        " ",
                                        {
                                            $ifNull: [
                                                "$doctor.lastName",
                                                ""
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    },

                    slmc: {
                        $first: {
                            $ifNull: [
                                "$docDetails.slmcReg",
                                "-"
                            ]
                        }
                    },

                    totalAppointments: {
                        $sum: 1
                    },

                    totalRevenue: {
                        $sum: "$amount"
                    },

                    averageRevenue: {
                        $avg: "$amount"
                    }

                }
            },

            {
                $project: {

                    doctorName: 1,

                    slmc: 1,

                    totalAppointments: 1,

                    totalRevenue: 1,

                    averageRevenue: {
                        $round: [
                            "$averageRevenue",
                            2
                        ]
                    }

                }
            },

            {
                $sort: {
                    totalRevenue: -1
                }
            }

        ]);

        const rankedDoctors = doctorPerformance.map((doctor, index) => ({
            rank: index + 1,
            ...doctor
        }));

        return res.status(200).json(rankedDoctors);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Oops! Something went wrong"
        });

    }
};

export const patientReport = async (req: any, res: any) => {
    try {

        const {
            filter = "Monthly",
            from,
            to
        } = req.query;

        const clinic = await Clinic.findOne({
            managementId: req.user.id
        });

        if (!clinic) {
            return res.status(404).json({
                message: "Clinic not found"
            });
        }

        let dateFilter: any = {};
        const now = new Date();

        // TODAY
        if (filter === "Today") {

            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };
        }

        // WEEKLY
        else if (filter === "Weekly") {

            const start = new Date();
            start.setDate(now.getDate() - 6);
            start.setHours(0, 0, 0, 0);

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: now
                }
            };
        }

        // MONTHLY
        else if (filter === "Monthly") {

            const start = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );

            const end = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0,
                23,
                59,
                59,
                999
            );

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };
        }

        // YEARLY
        else if (filter === "Yearly") {

            const start = new Date(
                now.getFullYear(),
                0,
                1
            );

            const end = new Date(
                now.getFullYear(),
                11,
                31,
                23,
                59,
                59,
                999
            );

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };
        }

        // CUSTOM RANGE
        if (from && to) {

            const fromDate = new Date(from as string);

            const toDate = new Date(to as string);
            toDate.setHours(23, 59, 59, 999);

            dateFilter = {
                createdAt: {
                    $gte: fromDate,
                    $lte: toDate
                }
            };
        }

        const patientReportDetails = await Billing.aggregate([

            {
                $match: {
                    clinicId: clinic._id,
                    status: "paid",
                    ...dateFilter
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },

            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "appointments",
                    let: {
                        patientId: "$userId"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                "$userId",
                                                "$$patientId"
                                            ]
                                        },
                                        {
                                            $eq: [
                                                "$clinicId",
                                                clinic._id
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "appointments"
                }
            },

            {
                $group: {

                    _id: "$userId",

                    fullName: {
                        $first: {
                            $trim: {
                                input: {
                                    $concat: [
                                        {
                                            $ifNull: [
                                                "$user.firstName",
                                                ""
                                            ]
                                        },
                                        " ",
                                        {
                                            $ifNull: [
                                                "$user.lastName",
                                                ""
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    },

                    address: {
                        $first: {
                            $ifNull: [
                                "$user.address",
                                "-"
                            ]
                        }
                    },

                    contact: {
                        $first: {
                            $ifNull: [
                                "$user.mobileNumber",
                                "-"
                            ]
                        }
                    },

                    appointments: {
                        $sum: 1
                    },

                    lastVisitedRaw: {
                        $max: {
                            $max: "$appointments.dateTime"
                        }
                    }

                }
            },

            {
                $project: {

                    _id: 0,

                    patientId: "$_id",

                    fullName: 1,

                    address: 1,

                    contact: 1,

                    appointments: 1,

                    lastVisited: {
                        $cond: [
                            {
                                $ifNull: [
                                    "$lastVisitedRaw",
                                    false
                                ]
                            },
                            {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: "$lastVisitedRaw"
                                }
                            },
                            "-"
                        ]
                    }

                }
            },

            {
                $sort: {
                    lastVisited: -1
                }
            }

        ]);

        return res.status(200).json(patientReportDetails);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Oops! Something went wrong"
        });

    }
};

export const revenueReport = async (req: any, res: any) => {
    try {

        const {
            filter = "Monthly",
            from,
            to
        } = req.query;

        const clinic = await Clinic.findOne({
            managementId: req.user.id
        });

        if (!clinic) {
            return res.status(404).json({
                message: "Clinic not found"
            });
        }

        let dateFilter: any = {};
        const now = new Date();

        // TODAY
        if (filter === "Today") {

            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };
        }

        // WEEKLY
        else if (filter === "Weekly") {

            const start = new Date();
            start.setDate(now.getDate() - 6);
            start.setHours(0, 0, 0, 0);

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: now
                }
            };
        }

        // MONTHLY
        else if (filter === "Monthly") {

            const start = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );

            const end = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0,
                23,
                59,
                59,
                999
            );

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };
        }

        // YEARLY
        else if (filter === "Yearly") {

            const start = new Date(
                now.getFullYear(),
                0,
                1
            );

            const end = new Date(
                now.getFullYear(),
                11,
                31,
                23,
                59,
                59,
                999
            );

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };
        }

        // CUSTOM RANGE
        if (from && to) {

            const fromDate = new Date(from as string);

            const toDate = new Date(to as string);
            toDate.setHours(23, 59, 59, 999);

            dateFilter = {
                createdAt: {
                    $gte: fromDate,
                    $lte: toDate
                }
            };
        }

        const revenueReportDetails = await Billing.aggregate([

            {
                $match: {
                    clinicId: clinic._id,
                    status: "paid",
                    ...dateFilter
                }
            },

            {
                $lookup: {
                    from: "appointments",
                    localField: "appointmentId",
                    foreignField: "_id",
                    as: "appointments"
                }
            },

            {
                $unwind: {
                    path: "$appointments",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "users"
                }
            },

            {
                $unwind: {
                    path: "$users",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "treatments",
                    localField: "treatmentId",
                    foreignField: "_id",
                    as: "treatments"
                }
            },

            {
                $unwind: {
                    path: "$treatments",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "doctorId",
                    foreignField: "_id",
                    as: "doctors"
                }
            },

            {
                $unwind: {
                    path: "$doctors",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "staffId",
                    foreignField: "_id",
                    as: "staff"
                }
            },

            {
                $unwind: {
                    path: "$staff",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $project: {

                    _id: 0,

                    invoiceNo: "$_id",

                    patient: {
                        $trim: {
                            input: {
                                $concat: [
                                    { $ifNull: ["$users.firstName", ""] },
                                    " ",
                                    { $ifNull: ["$users.lastName", ""] }
                                ]
                            }
                        }
                    },

                    service: {
                        $reduce: {
                            input: {
                                $ifNull: [
                                    "$treatments.treatments",
                                    []
                                ]
                            },
                            initialValue: "",
                            in: {
                                $concat: [
                                    "$$value",
                                    {
                                        $cond: [
                                            {
                                                $eq: [
                                                    "$$value",
                                                    ""
                                                ]
                                            },
                                            "",
                                            ", "
                                        ]
                                    },
                                    "$$this.name"
                                ]
                            }
                        }
                    },

                    doctor: {
                        $trim: {
                            input: {
                                $concat: [
                                    "Dr. ",
                                    { $ifNull: ["$doctors.firstName", ""] },
                                    " ",
                                    { $ifNull: ["$doctors.lastName", ""] }
                                ]
                            }
                        }
                    },

                    amount: "$amount",

                    method: {
                        $ifNull: [
                            "$appointments.method",
                            "-"
                        ]
                    },

                    status: "$status",

                    billedBy: {
                        $trim: {
                            input: {
                                $concat: [
                                    { $ifNull: ["$staff.firstName", ""] },
                                    " ",
                                    { $ifNull: ["$staff.lastName", ""] }
                                ]
                            }
                        }
                    },

                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    }
                }
            },

            {
                $sort: {
                    date: -1
                }
            }

        ]);

        return res.status(200).json(revenueReportDetails);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Oops! Something went wrong"
        });

    }
};

export const appointmentReport = async (req: any, res: any) => {
    try {

        const {
            filter = "Monthly",
            from,
            to
        } = req.query;

        const clinic = await Clinic.findOne({
            managementId: req.user.id
        });

        if (!clinic) {
            return res.status(404).json({
                message: "Clinic not found"
            });
        }

        let dateFilter: any = {};
        const now = new Date();

        // TODAY
        if (filter === "Today") {

            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };
        }

        // WEEKLY
        else if (filter === "Weekly") {

            const start = new Date();
            start.setDate(now.getDate() - 6);
            start.setHours(0, 0, 0, 0);

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: now
                }
            };
        }

        // MONTHLY
        else if (filter === "Monthly") {

            const start = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );

            const end = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0,
                23,
                59,
                59,
                999
            );

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };
        }

        // YEARLY
        else if (filter === "Yearly") {

            const start = new Date(
                now.getFullYear(),
                0,
                1
            );

            const end = new Date(
                now.getFullYear(),
                11,
                31,
                23,
                59,
                59,
                999
            );

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };
        }

        // CUSTOM RANGE
        if (from && to) {

            const fromDate = new Date(from as string);

            const toDate = new Date(to as string);
            toDate.setHours(23, 59, 59, 999);

            dateFilter = {
                createdAt: {
                    $gte: fromDate,
                    $lte: toDate
                }
            };
        }

        const appointmentReportDetails = await Appointment.aggregate([

            {
                $match: {
                    clinicId: clinic._id,
                    ...dateFilter
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "users"
                }
            },

            {
                $unwind: {
                    path: "$users",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "doctorId",
                    foreignField: "_id",
                    as: "doctors"
                }
            },

            {
                $unwind: {
                    path: "$doctors",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "sessions",
                    localField: "sessionId",
                    foreignField: "_id",
                    as: "sessions"
                }
            },

            {
                $unwind: {
                    path: "$sessions",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $project: {

                    _id: 0,

                    appointmentId: "$_id",

                    userName: {
                        $trim: {
                            input: {
                                $concat: [
                                    {
                                        $ifNull: [
                                            "$users.firstName",
                                            ""
                                        ]
                                    },
                                    " ",
                                    {
                                        $ifNull: [
                                            "$users.lastName",
                                            ""
                                        ]
                                    }
                                ]
                            }
                        }
                    },

                    doctorName: {
                        $trim: {
                            input: {
                                $concat: [
                                    "Dr. ",
                                    {
                                        $ifNull: [
                                            "$doctors.firstName",
                                            ""
                                        ]
                                    },
                                    " ",
                                    {
                                        $ifNull: [
                                            "$doctors.lastName",
                                            ""
                                        ]
                                    }
                                ]
                            }
                        }
                    },

                    sessionDateTime: {
                        $cond: [
                            {
                                $ifNull: [
                                    "$sessions.startDateTime",
                                    false
                                ]
                            },
                            {
                                $dateToString: {
                                    format: "%Y-%m-%d %H:%M",
                                    date: "$sessions.startDateTime"
                                }
                            },
                            "-"
                        ]
                    },

                    status: 1,

                    createdAt: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    }

                }
            },

            {
                $sort: {
                    createdAt: -1
                }
            }

        ]);

        return res.status(200).json(appointmentReportDetails);

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Oops! Something went wrong"
        });

    }
};

export const patientDemographicReport = async (req: any, res: any) => {
    try {
        const { filter = "Monthly", from, to } = req.query;

        const clinic = await Clinic.findOne({
            managementId: req.user.id,
        });

        if (!clinic) {
            return res.status(404).json({ message: "Clinic not found" });
        }
        const now = new Date();
        let dateFilter: any = {};

        // TODAY
        if (filter === "Today") {
            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            dateFilter.createdAt = {
                $gte: start,
                $lte: end,
            };
        }

        // WEEKLY
        else if (filter === "Weekly") {
            const start = new Date();
            start.setDate(now.getDate() - 6);
            start.setHours(0, 0, 0, 0);

            dateFilter.createdAt = {
                $gte: start,
                $lte: now,
            };
        }

        // MONTHLY
        else if (filter === "Monthly") {
            dateFilter.createdAt = {
                $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                $lte: new Date(
                    now.getFullYear(),
                    now.getMonth() + 1,
                    0,
                    23,
                    59,
                    59,
                    999
                ),
            };
        }

        // YEARLY
        else if (filter === "Yearly") {
            dateFilter.createdAt = {
                $gte: new Date(now.getFullYear(), 0, 1),
                $lte: new Date(
                    now.getFullYear(),
                    11,
                    31,
                    23,
                    59,
                    59,
                    999
                ),
            };
        }

        // CUSTOM
        if (from && to) {
            const fromDate = new Date(from as string);
            const toDate = new Date(to as string);
            toDate.setHours(23, 59, 59, 999);

            dateFilter.createdAt = {
                $gte: fromDate,
                $lte: toDate,
            };
        }

        const patients = await Appointment.aggregate([
            {
                $match: {
                    clinicId: clinic._id,
                    ...dateFilter,
                },
            },
            {
                $group: {
                    _id: "$userId",
                    visits: {
                        $sum: 1,
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "patient",
                },
            },
            {
                $unwind: "$patient",
            },
        ]);

        //return res.status(200).json(patients)

        let male = 0;
        let female = 0;

        let ageTotal = 0;
        let ageCount = 0;

        let newPatients = 0;
        let returningPatients = 0;
        let oneTimePatients = 0;

        const ageGroups = {
            "0-17": 0,
            "18-30": 0,
            "31-45": 0,
            "46-60": 0,
            "60+": 0,
        };

        const topPatients: any[] = [];
        const allPatients: any[] = [];

        patients.forEach((patient: any) => {
            if (patient.patient.gender === "male") male++;
            else female++;

            const birth = new Date(patient.patient.birthDay);

            if (!isNaN(birth.getTime())) {
                const age = Math.floor(
                    (Date.now() - birth.getTime()) /
                    (365.25 * 24 * 60 * 60 * 1000)
                );

                ageTotal += age;
                ageCount++;

                if (age <= 17) ageGroups["0-17"]++;
                else if (age <= 30) ageGroups["18-30"]++;
                else if (age <= 45) ageGroups["31-45"]++;
                else if (age <= 60) ageGroups["46-60"]++;
                else ageGroups["60+"]++;
            }

            if (patient.visits === 1)
                oneTimePatients++;
            else
                returningPatients++;

            if (dateFilter.createdAt) {
                if (
                    patient.patient.createdAt >= dateFilter.createdAt.$gte &&
                    patient.patient.createdAt <= dateFilter.createdAt.$lte
                ) {
                    newPatients++;
                }
            } else {
                newPatients++;
            }

            topPatients.push({
                name:
                    patient.patient.firstName +
                    " " +
                    patient.patient.lastName,
                visits: patient.visits,
            });

            allPatients.push({
                name: patient.patient.firstName +
                    " " +
                    patient.patient.lastName,
                birthDay: patient.patient.birthDay,
                address: patient.patient.address,
                mobileNumber: patient.patient.mobileNumber
            });
        });

        topPatients.sort(
            (a: any, b: any) => b.visits - a.visits
        );

        const totalPatients = patients.length;

        const totalVisits = patients.reduce(
            (sum: number, patient: any) => sum + patient.visits,
            0
        );

        return res.status(200).json({
            summary: {
                totalPatients,
                malePatients: male,
                femalePatients: female,

                averageAge:
                    ageCount > 0
                        ? Number((ageTotal / ageCount).toFixed(1))
                        : 0,

                newPatients,
                returningPatients,
                oneTimePatients,

                averageVisits:
                    totalPatients > 0
                        ? Number((totalVisits / totalPatients).toFixed(2))
                        : 0,
            },

            PatientsDetals: allPatients,

            genderDistribution: [
                {
                    gender: "Male",
                    count: male,
                    percentage:
                        totalPatients > 0
                            ? Number(
                                ((male * 100) / totalPatients).toFixed(2)
                            )
                            : 0,
                },
                {
                    gender: "Female",
                    count: female,
                    percentage:
                        totalPatients > 0
                            ? Number(
                                ((female * 100) / totalPatients).toFixed(2)
                            )
                            : 0,
                },
            ],

            ageDistribution: Object.entries(ageGroups).map(
                ([ageGroup, count]) => ({
                    ageGroup,
                    count,
                    percentage:
                        totalPatients > 0
                            ? Number(
                                ((count * 100) / totalPatients).toFixed(2)
                            )
                            : 0,
                })
            ),

            topPatients: topPatients.slice(0, 10),
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Oops! Something went wrong",
        });
    }
};