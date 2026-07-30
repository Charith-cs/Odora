import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../../../services/authService";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";


const userSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(50, "Maximum 50 characters")
        .regex(/^[A-Za-z\s'-]+$/, "Only letters are allowed"),

    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .max(50, "Maximum 50 characters")
        .regex(/^[A-Za-z\s'-]+$/, "Only letters are allowed"),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .max(100)
        .email("Invalid email format"),

    gender: z.enum(["male", "female"], {
        errorMap: () => ({
            message: "Gender is required",
        }),
    }),

    mobileNumber: z
        .string()
        .trim()
        .regex(/^07\d{8}$/, "Invalid Sri Lankan mobile number"),

    birthDay: z
        .string()
        .min(1, "Birth date is required")
        .refine((value) => {
            const birth = new Date(value);

            if (Number.isNaN(birth.getTime())) {
                return false;
            }

            const today = new Date();

            if (birth > today) {
                return false;
            }

            const age = Math.floor(
                (today.getTime() - birth.getTime()) /
                (365.25 * 24 * 60 * 60 * 1000)
            );

            return age >= 0 && age <= 120;
        }, {
            message: "Invalid birth date",
        }),

    address: z
        .string()
        .trim()
        .min(1, "Address is required")
        .max(255, "Maximum 255 characters"),

    password: z
        .string()
        .min(8, "Minimum 8 characters")
        .max(16, "Maximum 16 characters")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[a-z]/, "Must contain a lowercase letter")
        .regex(/[0-9]/, "Must contain a number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain a special character"),

    role: z.literal("user"),
});

type FormData = z.infer<typeof userSchema>;

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            role: "user",
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            const res = await registerUser(data);
            toast.success(res.message);
            navigate("/auth");
        } catch (err) {
            console.error(err);
            toast.error("Oops! Something went wrong");
        }
    };

    return (
        <div>
            <section className="flex flex-col flex-1 px-6 sm:px-10 lg:px-14 py-10 lg:py-14">

                <h2 className="text-3xl sm:text-4xl font-bold text-[#2596be] text-center">
                    Create Your Account
                </h2>

                <p className="text-center text-gray-600 mt-4 mb-10 leading-7">
                    Join Odora today and begin managing your dental care with confidence.
                </p>

                {/* First Name */}

                <label className="font-medium text-gray-700">
                    First Name
                </label>

                <input
                    {...register("firstName")}
                    type="text"
                    placeholder="John"
                    className={`mt-2 h-14 rounded-xl border bg-white px-4 outline-none transition-all
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

                {/* Last Name */}

                <label className="mt-6 font-medium text-gray-700">
                    Last Name
                </label>

                <input
                    {...register("lastName")}
                    type="text"
                    placeholder="Doe"
                    className={`mt-2 h-14 rounded-xl border bg-white px-4 outline-none transition-all
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

                {/* Email */}

                <label className="mt-6 font-medium text-gray-700">
                    Email Address
                </label>

                <input
                    {...register("email")}
                    type="email"
                    placeholder="Enter your email"
                    className={`mt-2 h-14 rounded-xl border bg-white px-4 outline-none transition-all
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

                {/* Mobile */}

                <label className="mt-6 font-medium text-gray-700">
                    Mobile Number
                </label>

                <input
                    {...register("mobileNumber")}
                    type="text"
                    placeholder="07XXXXXXXX"
                    className={`mt-2 h-14 rounded-xl border bg-white px-4 outline-none transition-all
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

                {/* Birthday */}

                <label className="mt-6 font-medium text-gray-700">
                    Date of Birth
                </label>

                <input
                    {...register("birthDay")}
                    type="date"
                    className={`mt-2 h-14 rounded-xl border bg-white px-4 outline-none transition-all
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

                {/* Gender */}

                <label className="mt-6 font-medium text-gray-700">
                    Gender
                </label>

                <select
                    {...register("gender")}
                    className={`mt-2 h-14 rounded-xl border bg-white px-4 outline-none transition-all
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

                {/* Address */}

                <label className="mt-6 font-medium text-gray-700">
                    Address
                </label>

                <input
                    {...register("address")}
                    type="text"
                    placeholder="Enter your address"
                    className={`mt-2 h-14 rounded-xl border bg-white px-4 outline-none transition-all
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

                {/* Password */}

                <label className="mt-6 font-medium text-gray-700">
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-[#2596be]"
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </button>

                </div>

                {errors.password && (
                    <p className="text-red-500 text-sm mt-2">
                        {errors.password.message}
                    </p>
                )}

                {/* Register */}

                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className=" mt-10 h-14 rounded-xl bg-[#2596be] text-white font-semibold transition-all duration-300 hover:bg-[#2088af] hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed " >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>

                {/* Login */}

                <div className="text-center mt-10 text-gray-600">
                    Already have an account?

                    <button type="button" onClick={() => navigate("/auth")} className="ml-2 font-semibold text-[#2596be] hover:underline">
                        Sign In
                    </button>

                </div>
            </section>
        </div>
    );
};

export default Register;