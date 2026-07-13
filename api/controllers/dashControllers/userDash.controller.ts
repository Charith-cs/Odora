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
import { json } from "stream/consumers";


export const dashCard = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
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

                const upcomming = await Appointment.countDocuments({
                    status: "approved"
                });

                const completed = await Appointment.countDocuments({
                    status: "completed"
                });

                const canceled = await Appointment.countDocuments({
                    status: "canceled"
                });

                // TOTAL COMPLETED TREATMENT AMOUNT
                const completedAppointments = await Appointment.find({
                    status: "completed"
                });

                const treatmentAmounts = await Promise.all(
                    completedAppointments.map(async (appointment) => {

                        const treatments = await Treatment.find({
                            appointmentId: appointment._id
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
                    status: "paid"
                });

                const paidAmounts = await Promise.all(
                    paidBills.map(async (bill) => {

                        const paidTreatments = await Treatment.find({
                            appointmentId: bill.appointmentId
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
                const registeredUsers = await User.countDocuments({
                    role: "user"
                });

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
        const imageUrl = `http://localhost:5000/upload/${file.filename}`;
        await User.findByIdAndUpdate(req.params.id, {
            img: imageUrl
        });
        res.status(200).json({ message: "Upload successful", imageUrl })
    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong", err });
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
        if (!id || Array.isArray(id)) {
            return res.status(404).json({ message: "Check yourID status" });
        }
        const user = await User.findById(id);

        const months = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);


        if (user?.role === "doctor") {
            const performance = await Appointment.aggregate([
                {
                    $match: {
                        doctorId: new mongoose.Types.ObjectId(id),
                        status: "paid"
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        patients: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            const perfMap = new Map(performance.map(i => [i._id, i.patients]));
            const formattedData = months.map((month, index) => ({
                month,
                patients: perfMap.get(index + 1) || 0
            }));


            const generated = await Billing.aggregate([
                {
                    $match: {
                        doctorId: new mongoose.Types.ObjectId(id),
                        status: "paid"
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        revenue: { $sum: "$amount" }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);
            const revMap = new Map(generated.map(i => [i._id, i.revenue]));
            const formattedRev = months.map((month, index) => ({
                month,
                revenue: revMap.get(index + 1) || 0
            }));

            return res.status(200).json({ performance: formattedData, generated: formattedRev });
        } else if (user?.role === "staff") {
            const monthly = await Billing.aggregate([
                {
                    $match: {
                        staffId: new mongoose.Types.ObjectId(id),
                        status: "paid"
                    }
                },
                {
                    $group: {
                        _id: { month: { $month: "$createdAt" } },
                        revenue: { $sum: "$amount" }
                    }
                },
                {
                    $sort: {
                        "_id.month": 1
                    }
                }
            ]);

            const revMap = new Map(
                monthly.map(i => [i._id.month, i.revenue])
            );

            const formattedRev = months.map((month, index) => ({
                month,
                revenue: revMap.get(index + 1) || 0
            }));

            //weekly

            const weekly = await Billing.aggregate([
                {
                    $match: {
                        staffId: new mongoose.Types.ObjectId(id),
                        status: "paid",
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: { $dayOfWeek: "$createdAt" },
                        revenue: { $sum: "$amount" }
                    }
                }
            ]);

            const map = new Map();
            weekly.forEach(item => {
                map.set(item._id, item.revenue);
            });

            const StaffRevData = [
                { day: "MON", revenue: map.get(2) || 0 },
                { day: "TUE", revenue: map.get(3) || 0 },
                { day: "WED", revenue: map.get(4) || 0 },
                { day: "THU", revenue: map.get(5) || 0 },
                { day: "FRI", revenue: map.get(6) || 0 },
                { day: "SAT", revenue: map.get(7) || 0 },
                { day: "SUN", revenue: map.get(1) || 0 },
            ];


            return res.status(200).json({ monthly: formattedRev, weekly: StaffRevData });
        }
    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong", err });
    }
}

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
                    status: "completed",
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
        return res.status(200).json({ totalPatients, totalDoctors, totalAppointments, totalRevenue });
    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
}

export const getAppointmentAnalytics = async (req: Request, res: Response) => {
    try {

        const { filter } = req.query;
        const now = new Date();
        let matchStage = {};

        if (filter === "Today") {
            const start = new Date(now.setHours(0, 0, 0, 0));
            const end = new Date(now.setHours(23, 59, 59, 999));

            matchStage = {
                createdAt: {
                    $gte: start,
                    $lte: end,
                },
            };
        }

        else if (filter === "Weekly") {
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);

            matchStage = {
                createdAt: {
                    $gte: weekAgo,
                },
            };
        }

        else if (filter === "Monthly") {
            matchStage = {
                createdAt: {
                    $gte: new Date(now.getFullYear(), 0, 1),
                },
            };
        }

        else if (filter === "Yearly") {
            matchStage = {
                createdAt: {
                    $gte: new Date(now.getFullYear(), 0, 1),
                },
            };
        }

        const analytics = await Appointment.aggregate([
            {
                $match: matchStage,
            },

            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                    },

                    total: { $sum: 1 },

                    approved: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "approved"] }, 1, 0],
                        },
                    },

                    completed: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
                        },
                    },

                    canceled: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "canceled"] }, 1, 0],
                        },
                    },
                    paid: {
                        $sum: {
                            $cond: [{ $eq: ['$status', "paid"] }, 1, 0],
                        }
                    }
                },
            },

            {
                $sort: {
                    "_id.month": 1,
                },
            },
        ]);

        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",];

        const formattedData = analytics.map((item) => ({
            month: months[item._id.month - 1],
            total: item.total,
            approved: item.approved,
            completed: item.completed,
            canceled: item.canceled,
            paid: item.paid
        }));

        res.status(200).json(formattedData);
    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
}

export const getRevenueTrend = async (req: Request, res: Response) => {
    try {
        const { filter } = req.query;
        const now = new Date();
        let matchStage: any = {};

        if (filter === "Today") {
            const start = new Date(now);
            start.setHours(0, 0, 0, 0);

            const end = new Date(now);
            end.setHours(23, 59, 59, 999);

            matchStage.createdAt = { $gte: start, $lte: end };
        }

        else if (filter === "Weekly") {
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);

            matchStage.createdAt = { $gte: weekAgo };
        }

        else if (filter === "Monthly") {
            const monthStart = new Date(now.getFullYear(), 0, 1);
            matchStage.createdAt = { $gte: monthStart };
        }

        else if (filter === "Yearly") {
            const yearStart = new Date(now.getFullYear(), 0, 1);
            matchStage.createdAt = { $gte: yearStart };
        }

        const revenue = await Billing.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" }
                    },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.month": 1 } }
        ]);

        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        const formattedData = revenue.map(item => ({
            month: months[item._id.month - 1],
            revenue: item.total
        }));

        return res.status(200).json(formattedData);

    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
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

export const docPerformanceReport = async (req: Request, res: Response) => {

    try {

        const id = req.params.id;

        const {
            filter,
            from,
            to
        } = req.query;

        if (!id || Array.isArray(id)) {
            return res.status(404).json({
                message: "Invalid ID status"
            });
        }

        const checkStatus = await Clinic.findOne({
            managementId: id
        });

        if (!checkStatus) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        // DATE FILTER
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
            start.setDate(now.getDate() - 7);

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
                59
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
                59
            );

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };
        }

        // CUSTOM DATE RANGE
        if (from && to) {

            dateFilter = {
                createdAt: {
                    $gte: new Date(from as string),
                    $lte: new Date(to as string)
                }
            };
        }

        // AGGREGATION
        const doctorPerformance = await Billing.aggregate([

            {
                $match: {
                    clinicId: checkStatus._id,
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
                $unwind: "$doctor"
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
                $unwind: "$docDetails"
            },

            {
                $group: {

                    _id: "$doctorId",

                    doctorName: {
                        $first: {
                            $concat: [
                                "$doctor.firstName",
                                " ",
                                "$doctor.lastName"
                            ]
                        }
                    },

                    slmc: {
                        $first: "$docDetails.slmcReg"
                    },

                    totalAppointments: {
                        $sum: 1
                    },

                    totalRevenue: {
                        $sum: "$amount"
                    }
                }
            },

            {
                $sort: {
                    totalRevenue: -1
                }
            }
        ]);

        return res.status(200).json(
            doctorPerformance
        );

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: "Oops! Something went wrong"
        });
    }
};

export const patientReport = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const {
            filter,
            from,
            to
        } = req.query;

        if (!id || Array.isArray(id)) {
            return res.status(404).json({ message: "Invalid ID status" });
        }

        const checkStatus = await Clinic.findOne({ managementId: id });

        if (!checkStatus) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // DATE FILTER
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
            start.setDate(now.getDate() - 7);

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
                59
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
                59
            );

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };
        }

        // CUSTOM DATE RANGE
        if (from && to) {

            dateFilter = {
                createdAt: {
                    $gte: new Date(from as string),
                    $lte: new Date(to as string)
                }
            };
        }

        const patientReposrtDetails = await Billing.aggregate([
            {
                $match: {
                    clinicId: checkStatus._id,
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
                },
            },
            {
                $unwind: "$user"
            },
            {
                $lookup: {
                    from: "appointments",
                    localField: "userId",
                    foreignField: "userId",
                    as: "appointments"
                }
            },
            {
                $unwind: {
                    path: "$appointments",
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $group: {
                    _id: "$user._id",
                    fullName: {
                        $first: {
                            $concat: [
                                "$user.firstName", " ", "$user.lastName"
                            ]
                        }
                    },
                    address: {
                        $first: "$user.address",
                    },
                    contact: {
                        $first: "$user.mobileNumber",
                    },
                    appointments: {
                        $sum: 1
                    },
                    lastVisitedRaw: {
                        $max: "$appointments.dateTime"
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
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: {
                                $max: "$lastVisitedRaw"
                            }
                        }
                    },
                },
            }
        ]);
        return res.status(200).json(patientReposrtDetails);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
}

export const revenueReport = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const {
            filter,
            from,
            to
        } = req.query;

        if (!id || Array.isArray(id)) {
            return res.status(404).json({ message: "Invalid ID status" });
        }

        const checkStatus = await Clinic.findOne({ managementId: id });

        if (!checkStatus) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // DATE FILTER
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
            start.setDate(now.getDate() - 7);

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
                59
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
                59
            );

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };
        }

        // CUSTOM DATE RANGE
        if (from && to) {

            dateFilter = {
                createdAt: {
                    $gte: new Date(from as string),
                    $lte: new Date(to as string)
                }
            };
        }

        const revenueReportDetails = await Billing.aggregate([
            {
                $match: {
                    clinicId: checkStatus._id,
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
                $unwind: "$appointments"
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
                $unwind: "$users"
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
                $unwind: "$treatments"
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
                $unwind: "$doctors"
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
                $unwind: "$staff"
            },
            {
                $project: {
                    invoiceNo: "$_id",
                    patient: {
                        $concat: [
                            "$users.firstName", " ", "$users.lastName"
                        ]
                    },
                    service: {
                        $reduce: {
                            input: { $ifNull: ["$treatments.treatments", []] },
                            initialValue: "",
                            in: {
                                $concat: [
                                    "$$value",
                                    {
                                        $cond: [
                                            { $eq: ["$$value", ""] },
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
                        $concat: [
                            "Dr.", " ", "$doctors.firstName", " ", "$doctors.lastName"
                        ]
                    },
                    amount: "$amount",
                    method: "$appointments.method",
                    status: "$status",
                    BilledBy: {
                        $concat :[
                            "$staff.firstName"," ","$staff.lastName"
                        ]
                    },
                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    }
                }
            }
        ]);
        return res.status(200).json(revenueReportDetails);

    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong", err });
    }
}

export const appointmentReport = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const {
            filter,
            from,
            to
        } = req.query;

        if (!id || Array.isArray(id)) {
            return res.status(404).json({ message: "Invalid ID status" });
        }

        const checkStatus = await Clinic.findOne({ managementId: id });

        if (!checkStatus) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // DATE FILTER
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
            start.setDate(now.getDate() - 7);

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
                59
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
                59
            );

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lte: end
                }
            };
        }

        // CUSTOM DATE RANGE
        if (from && to) {

            dateFilter = {
                createdAt: {
                    $gte: new Date(from as string),
                    $lte: new Date(to as string)
                }
            };
        }

        const appointmentReportDetails = await Appointment.aggregate([
            {
                $match: {
                    clinicId: checkStatus._id,
                    status: "paid",
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
                $unwind: "$users"
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
                $unwind: "$doctors"
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
                $unwind: "$sessions"
            },
            {
                $project: {
                    id: "$_id",
                    userName: {
                        $concat: [
                            "$users.firstName", " ", "$users.lastName"
                        ]
                    },
                    doctorName: {
                        $concat: [
                            "Dr.", "$doctors.firstName", " ", "$doctors.lastName"
                        ]
                    },
                    sessionDateTime: {
                        $dateToString: {
                            format: "%Y-%m-%d %H:%M",
                            date: "$sessions.startDateTime"
                        }
                    },
                    status: "$status",
                    createdAt: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    }
                }
            }
        ]);
        return res.status(200).json(appointmentReportDetails);
    } catch (err) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
}