import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { loginUser } from "../../../services/authService";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required").min(6, "Minimum 6 characters required"),
});

type FormData = z.infer<typeof loginSchema>;

const Login = () => {

    const auth = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormData>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: FormData) => {
        try {
            const res = await loginUser(data);
            auth?.login(res);
            toast.success(res.message);

            switch (res.user.role) {
                case "admin":
                    navigate("/admin_dash");
                    break;
                case "doctor":
                    navigate("/doctor_dash");
                    break;
                case "staff":
                    navigate("/staff_dash");
                    break;
                default:
                    navigate("/user_dash");
            }

        } catch (err) {
            toast.error("Oops! Something went wrong");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col flex-1 px-6 sm:px-10 lg:px-14 py-10 lg:py-14">
                <div className="hidden lg:block absolute top-10 right-0 h-[85%] w-px bg-gray-200" />
                <h2 className="text-3xl sm:text-4xl font-bold text-[#2596be] text-center">
                    Welcome Back
                </h2>

                <p className="text-center text-gray-600 mt-4 mb-10 leading-7">
                    Sign in to manage your appointments and continue your dental care journey.
                </p>

                <label className="font-medium text-gray-700">
                    Email Address
                </label>

                <input
                    {...register("email")}
                    type="email"
                    placeholder="Enter your email address"
                    className={`mt-2 h-14 w-full rounded-xl border bg-white px-4 outline-none transition-all
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


                <label className="mt-6 font-medium text-gray-700">
                    Password
                </label>

                <div className="relative mt-2">

                    <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={`w-full h-14 rounded-xl border bg-white px-4 pr-14 outline-none transition-all
                focus:border-[#2596be]
                focus:ring-2
                focus:ring-cyan-100
                ${errors.password
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                    />

                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-[#2596be] transition">
                        {showPassword ? "🙈" : "👁️"}
                    </button>

                </div>

                {errors.password && (
                    <p className="text-red-500 text-sm mt-2">
                        {errors.password.message}
                    </p>
                )}


                <div className="flex justify-end mt-3">

                    <button type="button" onClick={() => navigate("/forgot-password")} className="text-sm font-medium text-[#2596be] hover:underline">
                        Forgot Password?
                    </button>

                </div>

                <button
                    disabled={isSubmitting}
                    className=" mt-10 h-14 rounded-xl bg-[#2596be] text-white font-semibold transition-all duration-300 hover:bg-[#2088af] hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ">
                    {isSubmitting ? "Signing In..." : "Sign In"}
                </button>


                <div className="text-center mt-10 text-gray-600">
                    Don't have an account?
                    <button type="button" onClick={() => navigate("/register")} className="ml-2 font-semibold text-[#2596be] hover:underline">
                        Create one
                    </button>

                </div>
            </form>
        </div>
    );
};

export default Login;