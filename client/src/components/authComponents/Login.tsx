import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useContext } from "react";
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
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 px-16 py-16 relative">
                <div className="hidden md:block absolute top-0 right-0 h-full w-[1px] bg-gray-300" />

                <h2 className="text-3xl mb-10 text-center">
                    Welcome back 😍 Please login to your account
                </h2>

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
                    <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                    </p>
                )}

                {/* Password */}
                <label className="mt-4">Password</label>
                <input
                    {...register("password")}
                    type="password"
                    placeholder="********"
                    className={`mt-2 shadow-md rounded-xl p-2 outline-none ${
                        errors.password ? "border border-red-500" : ""
                    }`}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                    </p>
                )}

                <button
                    disabled={isSubmitting}
                    className="mt-14 bg-sky-500 hover:bg-sky-600 hover:shadow-xl p-2 rounded-xl text-white font-semibold disabled:opacity-50"
                >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </button>

                <span className="flex items-center justify-center mt-10">
                    Don't have an account?{" "}
                    <span
                        className="text-sky-500 underline cursor-pointer ml-1"
                        onClick={() => navigate("/register")}
                    >
                        Sign up for free!
                    </span>
                </span>
            </form>
        </div>
    );
};

export default Login;