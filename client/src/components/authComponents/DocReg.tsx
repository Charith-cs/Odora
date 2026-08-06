import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../services/authService';
import toast from 'react-hot-toast';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

// ✅ Zod schema
const doctorSchema = z.object({
    firstName: z.string().min(1, "First name is required").regex(/^[A-Za-z\s]+$/, "Only letters allowed"),
    lastName: z.string().min(1, "Last name is required").regex(/^[A-Za-z\s]+$/, "Only letters allowed"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    gender: z.string().min(1, "Gender is required"),
    mobileNumber: z.string().min(1, "Mobile number is required").regex(/^07[0-9]{8}$/, "Invalid Sri Lankan number"),
    university: z.string().min(1, "University name is required").regex(/^[A-Za-z\s]+$/, "Valid name allowed"),
    slmcReg: z.string().min(1, "SLMC number is required").regex(/^[0-9\s]+$/, "Valid SLMC allowed"),
    degree: z.string().min(1, "Degree is required").regex(/^[A-Za-z\s]+$/, "Valid degree allowed"),
    specialization: z
        .string()
        .min(1, "Specialization is required")
        .transform((val) =>
            val.split(",").map((v) => v.trim()).filter(Boolean)
        ),
    experience: z.string().min(1, "Experience is required").regex(/^[0-9\s]+$/, "Numbers are allowed"),
    consultationFee: z.string().min(1, "Consultation fee is required").regex(/^[0-9\s]+$/, "Valid fee allowed"),
    birthDay: z.string().min(1, "Birth date is required").refine((date) => new Date(date) <= new Date(), {
        message: "Birth date cannot be in future",
    }),
    desc: z.string().min(10, "Description is required").max(1000, "Description is too long"),
    address: z.string().min(1, "Address is required"),
    password: z.string().min(1, "Password is required").min(6, "Minimum 6 characters required"),
    role: z.literal("doctor"),
});

type FormData = z.infer<typeof doctorSchema>;

const DocReg = () => {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormData>({
        resolver: zodResolver(doctorSchema),
        defaultValues: {
            role: "doctor"
        }
    });

    const onSubmit = async (data: FormData) => {
        try {
            const res = await registerUser(data);
            toast.success(res.message);
            navigate("/auth");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Oops! Something went wrong");
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">

            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2596be]">Register as a Dental Professional</h1>
                    <p className="mt-5 text-gray-600 max-w-3xl mx-auto leading-8"> Join Odora and expand your professional practice. Manage appointments, connect with patients, and provide exceptional dental care through our modern healthcare platform.</p>
                </div>

                {/* Personal Information Card */}

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 lg:p-10 mb-10">

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-[#2596be]">👤 Personal Information</h2>
                        <p className="text-gray-500 mt-2">Please provide your personal details.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}

                        <div>

                            <label className="font-medium text-gray-700">
                                First Name
                            </label>

                            <input
                                {...register("firstName")}
                                type="text"
                                placeholder="John"
                                className={`mt-2 w-full h-14 rounded-xl border px-4 outline-none transition-all
                        focus:border-[#2596be]
                        focus:ring-2
                        focus:ring-cyan-100
                        ${errors.firstName
                                        ? "border-red-500"
                                        : "border-gray-200"
                                    }`}
                            />

                            {errors.firstName && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.firstName.message}
                                </p>
                            )}

                        </div>

                        {/* Last Name */}

                        <div>

                            <label className="font-medium text-gray-700">
                                Last Name
                            </label>

                            <input
                                {...register("lastName")}
                                type="text"
                                placeholder="Doe"
                                className={`mt-2 w-full h-14 rounded-xl border px-4 outline-none transition-all
                        focus:border-[#2596be]
                        focus:ring-2
                        focus:ring-cyan-100
                        ${errors.lastName
                                        ? "border-red-500"
                                        : "border-gray-200"
                                    }`}
                            />

                            {errors.lastName && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.lastName.message}
                                </p>
                            )}

                        </div>

                        {/* Email */}

                        <div>

                            <label className="font-medium text-gray-700">
                                Email Address
                            </label>

                            <input
                                {...register("email")}
                                type="email"
                                placeholder="Enter your email"
                                className={`mt-2 w-full h-14 rounded-xl border px-4 outline-none transition-all
                        focus:border-[#2596be]
                        focus:ring-2
                        focus:ring-cyan-100
                        ${errors.email
                                        ? "border-red-500"
                                        : "border-gray-200"
                                    }`}
                            />

                            {errors.email && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.email.message}
                                </p>
                            )}

                        </div>

                        {/* Mobile */}

                        <div>

                            <label className="font-medium text-gray-700">
                                Mobile Number
                            </label>

                            <input
                                {...register("mobileNumber")}
                                type="text"
                                placeholder="07XXXXXXXX"
                                className={`mt-2 w-full h-14 rounded-xl border px-4 outline-none transition-all
                        focus:border-[#2596be]
                        focus:ring-2
                        focus:ring-cyan-100
                        ${errors.mobileNumber
                                        ? "border-red-500"
                                        : "border-gray-200"
                                    }`}
                            />

                            {errors.mobileNumber && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.mobileNumber.message}
                                </p>
                            )}

                        </div>

                        {/* Birthday */}

                        <div>

                            <label className="font-medium text-gray-700">
                                Date of Birth
                            </label>

                            <input
                                {...register("birthDay")}
                                type="date"
                                className={`mt-2 w-full h-14 rounded-xl border px-4 outline-none transition-all
                        focus:border-[#2596be]
                        focus:ring-2
                        focus:ring-cyan-100
                        ${errors.birthDay
                                        ? "border-red-500"
                                        : "border-gray-200"
                                    }`}
                            />

                            {errors.birthDay && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.birthDay.message}
                                </p>
                            )}

                        </div>

                        {/* Gender */}

                        <div>

                            <label className="font-medium text-gray-700">
                                Gender
                            </label>

                            <select
                                {...register("gender")}
                                className={`mt-2 w-full h-14 rounded-xl border px-4 outline-none transition-all
                        focus:border-[#2596be]
                        focus:ring-2
                        focus:ring-cyan-100
                        ${errors.gender
                                        ? "border-red-500"
                                        : "border-gray-200"
                                    }`}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>

                            {errors.gender && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.gender.message}
                                </p>
                            )}

                        </div>

                        {/* Address */}

                        <div className="md:col-span-2">

                            <label className="font-medium text-gray-700">
                                Address
                            </label>

                            <input
                                {...register("address")}
                                type="text"
                                placeholder="Enter your address"
                                className={`mt-2 w-full h-14 rounded-xl border px-4 outline-none transition-all
                        focus:border-[#2596be]
                        focus:ring-2
                        focus:ring-cyan-100
                        ${errors.address
                                        ? "border-red-500"
                                        : "border-gray-200"
                                    }`}
                            />

                            {errors.address && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.address.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Professional Information Card */}

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 lg:p-10 mb-10">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-[#2596be]">🦷 Professional Information</h2>
                        <p className="text-gray-500 mt-2">Provide your professional qualifications and practice details. </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* University */}

                        <div>

                            <label className="font-medium text-gray-700">
                                University
                            </label>

                            <input
                                {...register("university")}
                                type="text"
                                placeholder="ex:University of Peradeniya"
                                className={`mt-2 w-full h-14 rounded-xl border px-4 outline-none transition-all
                        focus:border-[#2596be]
                        focus:ring-2
                        focus:ring-cyan-100
                        ${errors.university
                                        ? "border-red-500"
                                        : "border-gray-200"
                                    }`}
                            />

                            {errors.university && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.university.message}
                                </p>
                            )}

                        </div>

                        {/* Degree */}

                        <div>

                            <label className="font-medium text-gray-700">
                                Degree
                            </label>

                            <input
                                {...register("degree")}
                                type="text"
                                placeholder="BDS"
                                className={`mt-2 w-full h-14 rounded-xl border px-4 outline-none transition-all
                        focus:border-[#2596be]
                        focus:ring-2
                        focus:ring-cyan-100
                        ${errors.degree
                                        ? "border-red-500"
                                        : "border-gray-200"
                                    }`}
                            />

                            {errors.degree && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.degree.message}
                                </p>
                            )}

                        </div>

                        {/* SLMC Registration */}

                        <div>

                            <label className="font-medium text-gray-700">
                                SLMC Registration Number
                            </label>

                            <input
                                {...register("slmcReg")}
                                type="text"
                                placeholder="Enter your SLMC Registration Number"
                                className={`mt-2 w-full h-14 rounded-xl border px-4 outline-none transition-all
                        focus:border-[#2596be]
                        focus:ring-2
                        focus:ring-cyan-100
                        ${errors.slmcReg
                                        ? "border-red-500"
                                        : "border-gray-200"
                                    }`}
                            />

                            {errors.slmcReg && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.slmcReg.message}
                                </p>
                            )}

                        </div>

                        {/* Specialization */}

                        <div>

                            <label className="font-medium text-gray-700">
                                Specialization
                            </label>

                            <input
                                {...register("specialization")}
                                type="text"
                                placeholder="Orthodontics"
                                className={`mt-2 w-full h-14 rounded-xl border px-4 outline-none transition-all
                        focus:border-[#2596be]
                        focus:ring-2
                        focus:ring-cyan-100
                        ${errors.specialization
                                        ? "border-red-500"
                                        : "border-gray-200"
                                    }`}
                            />

                            {errors.specialization && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.specialization.message}
                                </p>
                            )}

                        </div>

                        {/* Experience */}

                        <div>

                            <label className="font-medium text-gray-700">
                                Years of Experience
                            </label>

                            <input
                                {...register("experience")}
                                type="text"
                                placeholder="5 Years"
                                className={`mt-2 w-full h-14 rounded-xl border px-4 outline-none transition-all
                        focus:border-[#2596be]
                        focus:ring-2
                        focus:ring-cyan-100
                        ${errors.experience
                                        ? "border-red-500"
                                        : "border-gray-200"
                                    }`}
                            />

                            {errors.experience && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.experience.message}
                                </p>
                            )}

                        </div>

                        {/* Consultation Fee */}

                        <div>

                            <label className="font-medium text-gray-700">
                                Consultation Fee (LKR)
                            </label>

                            <input
                                {...register("consultationFee")}
                                type="text"
                                placeholder="3000"
                                className={`mt-2 w-full h-14 rounded-xl border px-4 outline-none transition-all
                        focus:border-[#2596be]
                        focus:ring-2
                        focus:ring-cyan-100
                        ${errors.consultationFee
                                        ? "border-red-500"
                                        : "border-gray-200"
                                    }`}
                            />

                            {errors.consultationFee && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.consultationFee.message}
                                </p>
                            )}

                        </div>

                        {/* Descripton Fee */}

                        <div className=" col-span-2">

                            <label className="font-medium text-gray-700">
                                Description
                            </label>

                            <input
                                {...register("desc")}
                                type="text"
                                placeholder="Hello! I'm Dr.Jhon Doe"
                                className={`mt-2 w-full h-14 rounded-xl border px-4 outline-none transition-all
                        focus:border-[#2596be]
                        focus:ring-2
                        focus:ring-cyan-100
                        ${errors.desc
                                        ? "border-red-500"
                                        : "border-gray-200"
                                    }`}
                            />

                            {errors.desc && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.desc.message}
                                </p>
                            )}

                        </div>
                    </div>
                </div>
                {/* Security */}

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 lg:p-10">

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-[#2596be]">🔒 Account Security </h2>
                        <p className="text-gray-500 mt-2"> Create a secure password to protect your professional account. </p>
                    </div>

                    {/* Password */}

                    <label className="font-medium text-gray-700">
                        Password
                    </label>

                    <div className="relative mt-2">

                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a secure password"
                            className={`w-full h-14 rounded-xl border bg-white px-4 pr-14 outline-none transition-all
                    focus:border-[#2596be]
                    focus:ring-2
                    focus:ring-cyan-100
                    ${errors.password
                                    ? "border-red-500"
                                    : "border-gray-200"
                                }`}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-[#2596be] transition"
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>

                    </div>

                    {errors.password && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.password.message}
                        </p>
                    )}

                    <div className="mt-8 rounded-2xl bg-cyan-50 border border-cyan-100 p-5">
                        <h3 className="font-semibold text-[#2596be]">Before you register </h3>
                        <p className="text-gray-600 mt-2 leading-7">Please ensure that your professional information is accurate. Your registration details may be reviewed before your account is approved on the Odora platform.</p>
                    </div>

                    <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}
                        className=" mt-10 w-full h-14 rounded-xl bg-[#21a262] text-white font-semibold transition-all duration-300 hover:bg-[#1b8b54] hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting
                            ? "Creating Professional Account..."
                            : "Register Now"}
                    </button>

                    <div className="text-center mt-8">

                        <button type="button" onClick={() => navigate("/auth")} className="text-[#2596be] font-semibold hover:underline">
                            ← Back to Registration Portal
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocReg;