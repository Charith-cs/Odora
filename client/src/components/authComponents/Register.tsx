import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../../../services/authService";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


const userSchema = z.object({
    firstName: z.string().min(1, "First name is required").regex(/^[A-Za-z\s]+$/, "Only letters allowed"),
    lastName: z.string().min(1, "Last name is required").regex(/^[A-Za-z\s]+$/, "Only letters allowed"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    gender: z.string().min(1, "Gender is required"),
    mobileNumber: z.string().min(1, "Mobile number is required").regex(/^07[0-9]{8}$/, "Invalid Sri Lankan number"),
    birthDay: z.string().min(1, "Birth date is required").refine(
        (date) => new Date(date) <= new Date(),
        { message: "Birth date cannot be in future" }
    ),
    address: z.string().min(1, "Address is required"),
    password: z.string().min(6, "Minimum 6 characters required"),
    role: z.literal("user"),
});

type FormData = z.infer<typeof userSchema>;

const Register = () => {
    const navigate = useNavigate();

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
            toast.error("Oops! Something went wrong");
        }
    };

    return (
        <div>
            <section className="flex flex-col flex-1 px-16 py-16">
                <h2 className="text-3xl mb-10 text-center">
                    Your smile deserves the best 😄 <br />
                    join <b>Odora</b> today.
                </h2>

                {/* First Name */}
                <label className="mt-2">First name</label>
                <input
                    {...register("firstName")}
                    type="text"
                    placeholder="Ex: John"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${
                        errors.firstName ? "border border-red-500" : ""
                    }`}
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
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${
                        errors.lastName ? "border border-red-500" : ""
                    }`}
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
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${
                        errors.email ? "border border-red-500" : ""
                    }`}
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
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${
                        errors.mobileNumber ? "border border-red-500" : ""
                    }`}
                />
                {errors.mobileNumber && (
                    <p className="text-red-500 text-sm">
                        {errors.mobileNumber.message}
                    </p>
                )}

                {/* Birthday */}
                <label className="mt-2">Birth Day</label>
                <input
                    {...register("birthDay")}
                    type="date"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${
                        errors.birthDay ? "border border-red-500" : ""
                    }`}
                />
                {errors.birthDay && (
                    <p className="text-red-500 text-sm">{errors.birthDay.message}</p>
                )}

                {/* Gender */}
                <label className="mt-2">Gender</label>
                <div
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${
                        errors.gender ? "border border-red-500" : ""
                    }`}
                >
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
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${
                        errors.address ? "border border-red-500" : ""
                    }`}
                />
                {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address.message}</p>
                )}

                {/* Password */}
                <label className="mt-2">Password</label>
                <input
                    {...register("password")}
                    type="password"
                    placeholder="********"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${
                        errors.password ? "border border-red-500" : ""
                    }`}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}

                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="mt-14 bg-sky-500 hover:bg-sky-600 p-2 rounded-xl text-white font-semibold"
                >
                    {isSubmitting ? "Signing up..." : "Sign up"}
                </button>

                <span className="flex justify-center mt-10">
                    <span>
                        Have an account?{" "}
                        <span
                            className="text-sky-500 underline cursor-pointer"
                            onClick={() => navigate("/auth")}
                        >
                            Sign in
                        </span>
                    </span>
                </span>
            </section>
        </div>
    );
};

export default Register;