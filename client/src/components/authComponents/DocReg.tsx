import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../services/authService';
import toast from 'react-hot-toast';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
    address: z.string().min(1, "Address is required"),
    password: z.string().min(1, "Password is required").min(6, "Minimum 6 characters required"),
    role: z.literal("doctor"),
});

type FormData = z.infer<typeof doctorSchema>;

const DocReg = () => {

    const navigate = useNavigate();

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
        <div>
            <div className=" mt-6 grid grid-cols-1 px-4 md:px-32">

                <h2 className=" text-3xl mb-10 text-center ">
                    “Register as a dentist on <b>Odora</b> and <br />grow your practice.”🥳
                </h2>

                {/* First Name */}
                <label className="mt-2">First name</label>
                <input
                    {...register("firstName")}
                    type="text"
                    placeholder="Ex: John"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.firstName ? "border border-red-500" : ""}`}
                />
                {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                )}

                {/* Last Name */}
                <label className="mt-2">Last name</label>
                <input
                    {...register("lastName")}
                    type="text"
                    placeholder="Ex: Doe"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.lastName ? "border border-red-500" : ""}`}
                />
                {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                )}

                {/* Email */}
                <label className="mt-2">Email</label>
                <input
                    {...register("email")}
                    type="text"
                    placeholder="Enter your Email"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.email ? "border border-red-500" : ""}`}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}

                {/* Mobile */}
                <label className="mt-2">Mobile number</label>
                <input
                    {...register("mobileNumber")}
                    type="text"
                    placeholder="07xxxxxxxx"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.mobileNumber ? "border border-red-500" : ""}`}
                />
                {errors.mobileNumber && (
                    <p className="text-red-500 text-sm">{errors.mobileNumber.message}</p>
                )}

                {/* Birthday */}
                <label className="mt-2">Birth Day</label>
                <input
                    {...register("birthDay")}
                    type="date"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.birthDay ? "border border-red-500" : ""}`}
                />
                {errors.birthDay && (
                    <p className="text-red-500 text-sm">{errors.birthDay.message}</p>
                )}

                {/* Gender */}
                <label className="mt-2">Gender</label>
                <div className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.gender ? "border border-red-500" : ""}`}>
                    <select
                        {...register("gender")}
                        className="w-full outline-none"
                    >
                        <option value="">Select below ...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                {errors.gender && (
                    <p className="text-red-500 text-sm">{errors.gender.message}</p>
                )}

                {/* Address */}
                <label className="mt-2">Address</label>
                <input
                    {...register("address")}
                    type="text"
                    placeholder="Enter your address"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.address ? "border border-red-500" : ""}`}
                />
                {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address.message}</p>
                )}

                {/* University */}
                <label className="mt-2">University</label>
                <input
                    {...register("university")}
                    type="text"
                    placeholder="Enter your address"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.university ? "border border-red-500" : ""}`}
                />
                {errors.university && (
                    <p className="text-red-500 text-sm">{errors.university.message}</p>
                )}

                {/* Degree */}
                <label className="mt-2">Name of the Degree</label>
                <input
                    {...register("degree")}
                    type="text"
                    placeholder="Enter your address"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.degree ? "border border-red-500" : ""}`}
                />
                {errors.degree && (
                    <p className="text-red-500 text-sm">{errors.degree.message}</p>
                )}

                {/* SLMC Reg No */}
                <label className="mt-2">SLMC Reg No</label>
                <input
                    {...register("slmcReg")}
                    type="text"
                    placeholder="Enter your address"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.slmcReg ? "border border-red-500" : ""}`}
                />
                {errors.slmcReg && (
                    <p className="text-red-500 text-sm">{errors.slmcReg.message}</p>
                )}

                {/* Specialization */}
                <label className="mt-2">Specialization</label>
                <input
                    {...register("specialization")}
                    type="text"
                    placeholder="Enter your address"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.specialization ? "border border-red-500" : ""}`}
                />
                {errors.specialization && (
                    <p className="text-red-500 text-sm">{errors.specialization.message}</p>
                )}

                {/* Experience */}
                <label className="mt-2">Experience</label>
                <input
                    {...register("experience")}
                    type="text"
                    placeholder="Enter your address"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.experience ? "border border-red-500" : ""}`}
                />
                {errors.experience && (
                    <p className="text-red-500 text-sm">{errors.experience.message}</p>
                )}

                {/* Consultation Fee */}
                <label className="mt-2">Consultation Fee</label>
                <input
                    {...register("consultationFee")}
                    type="text"
                    placeholder="Enter your address"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.consultationFee ? "border border-red-500" : ""}`}
                />
                {errors.consultationFee && (
                    <p className="text-red-500 text-sm">{errors.consultationFee.message}</p>
                )}

                {/* Password */}
                <label className="mt-2">Password</label>
                <input
                    {...register("password")}
                    type="password"
                    placeholder="********"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.password ? "border border-red-500" : ""}`}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}

                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="mt-14 bg-sky-500 hover:bg-sky-600 p-2 rounded-xl text-white font-semibold"
                >
                    {isSubmitting ? "Signing up..." : "Register Now"}
                </button>

                <span className=" flex items-center justify-center mt-10">
                    <span
                        className=" text-sky-500 underline cursor-pointer"
                        onClick={() => navigate("/auth")}
                    >
                        Back to the registration portal
                    </span>
                </span>
            </div>
        </div>
    );
};

export default DocReg;