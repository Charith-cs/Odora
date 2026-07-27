import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { registerUser } from "../../../../services/authService";
import type { UpdateLabelType } from "../../../../types/types";
import API from "../../../../api/axios";

const currentUser = JSON.parse(localStorage.getItem("user") || "null");
const nameRegex = /^[A-Za-z'-]+(?: [A-Za-z'-]+)*$/;
const phoneRegex = /^07\d{8}$/;

const isAdult = (date: string) => {
    const today = new Date();
    const birth = new Date(date);

    if (isNaN(birth.getTime())) return false;

    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();

    if (
        month < 0 ||
        (month === 0 && today.getDate() < birth.getDate())
    ) {
        age--;
    }

    return age >= 18;
};

const baseSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, "First name must contain at least 2 characters")
        .max(50, "First name cannot exceed 50 characters")
        .regex(
            nameRegex,
            "Only letters, spaces, apostrophes (') and hyphens (-) are allowed"
        ),

    lastName: z
        .string()
        .trim()
        .min(2, "Last name must contain at least 2 characters")
        .max(50, "Last name cannot exceed 50 characters")
        .regex(
            nameRegex,
            "Only letters, spaces, apostrophes (') and hyphens (-) are allowed"
        ),

    email: z
        .string()
        .trim()
        .email("Please enter a valid email address")
        .max(100, "Email cannot exceed 100 characters"),

    gender: z
    .enum(["male", "female"])
    .refine((value) => value === "male" || value === "female", {
        message: "Please select a gender",
    }),

    mobileNumber: z
        .string()
        .trim()
        .regex(
            phoneRegex,
            "Please enter a valid Sri Lankan mobile number"
        ),

    birthDay: z
        .string()
        .refine(
            (date) => {
                const birth = new Date(date);
                return !isNaN(birth.getTime());
            },
            {
                message: "Please select a valid birth date",
            }
        )
        .refine(
            (date) => new Date(date) <= new Date(),
            {
                message: "Birth date cannot be in the future",
            }
        )
        .refine(isAdult, {
            message: "User must be at least 18 years old",
        }),

    address: z
        .string()
        .trim()
        .min(5, "Address must contain at least 5 characters")
        .max(150, "Address cannot exceed 150 characters"),

    password: z
        .string()
        .min(8, "Password must contain at least 8 characters")
        .max(20, "Password cannot exceed 20 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[0-9]/, "Password must contain a number")
        .regex(
            /[!@#$%^&*(),.?":{}|<>]/,
            "Password must contain a special character"
        ),
});

const userSchema = baseSchema.extend({
    role: z.literal("user"),
});

const doctorSchema = baseSchema.extend({
    role: z.literal("doctor"),

    university: z
        .string()
        .trim()
        .min(3, "University name is required")
        .max(100, "University name is too long"),

    slmcReg: z
        .string()
        .trim()
        .min(4, "SLMC Registration Number is required")
        .max(5, "Invalid SLMC Registration Number"),

    degree: z
        .string()
        .trim()
        .min(3, "Degree is required")
        .max(100, "Degree name is too long"),

    specialization: z
        .string()
        .trim()
        .min(2, "Please enter at least one specialization")
        .transform((value) =>
            value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
        )
        .refine(
            (list) => list.length > 0,
            "Please enter at least one specialization"
        ),

    experience: z.coerce
        .number()
        .min(0, "Experience cannot be negative")
        .max(60, "Experience cannot exceed 60 years"),

    consultationFee: z.coerce
        .number()
        .min(500, "Minimum consultation fee is 500")
        .max(100000, "Consultation fee is too high"),
});

const staffSchema = baseSchema.extend({
    role: z.literal("staff"),

    clinic: z
        .string()
        .trim()
        .min(2, "Please select a clinic"),
});

const createSchema = (role: "user" | "doctor" | "staff") =>
    role === "doctor" ? doctorSchema : role === "staff" ? staffSchema : userSchema;

type Props = {
    updateLabel: UpdateLabelType[];
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    role: "user" | "doctor" | "staff";
    refresh: () => Promise<void>;
};

type FormData =
    | z.infer<typeof userSchema>
    | z.infer<typeof doctorSchema>
    | z.infer<typeof staffSchema>;

const Add = ({ updateLabel, setShowForm, role , refresh }: Props) => {
    const schema = React.useMemo(() => createSchema(role), [role]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            gender: "",
            mobileNumber: "",
            birthDay: "",
            address: "",
            password: "",
            role,
        },
    });

    React.useEffect(() => {
        reset({
            firstName: "",
            lastName: "",
            email: "",
            gender: "",
            mobileNumber: "",
            birthDay: "",
            address: "",
            password: "",
            role,
        });
    }, [role, reset]);

    const onSubmit = async (data: any) => {
        try {
            const payload = { ...data, role };
            const res = await registerUser(payload);
            if (res.user.role === "doctor") {
                try {
                    await API.put(`/clinic/regadd/${res.user._id}`, { id: currentUser._id });
                    toast.success("Doctor added successfully");
                } catch (err: any) {
                    toast.error(err?.response?.data?.message || "Oops! Something went wrong");
                }
            }
            toast.success(res.message || "User registered successfully");
            await refresh();
            reset();
            setShowForm(false);
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <div className="w-full">
            <form
                className="space-y-6"
                onSubmit={handleSubmit(
                    onSubmit,
                    (errors) => {
                        console.log("❌ VALIDATION FAILED:", errors);
                        const firstError = Object.values(errors)[0] as any;
                        if (firstError?.message) toast.error("Please correct the highlighted fields.");
                    }
                )}
            >
                {updateLabel.map((item) => (
                    <div className="flex flex-col" key={String(item.key)}>
                        <label className="mb-2 text-sm font-semibold text-gray-700">{item.label}</label>

                        <input
                            type={item.type || "text"}
                            placeholder={item.placeholder}
                            defaultValue={item?.value || ""}
                            disabled={item?.disabled}
                            {...register(item.key as any)}
                            className={`w-full rounded-2xl border px-4 py-3 text-sm placeholder:text-gray-400 transition-all duration-300 ${item?.disabled
                                ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                                : errors?.[item.key]
                                    ? "border-red-500 bg-red-50 text-gray-700 focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none"
                                    : "border-gray-200 bg-gray-50 text-gray-700 focus:border-[#2596be] focus:bg-white focus:ring-4 focus:ring-[#2596be]/10 focus:outline-none"
                                }`}
                        />

                        {errors?.[item.key] && (
                            <p className="mt-2 text-sm font-medium text-red-500">
                                {String((errors as any)[item.key]?.message)}
                            </p>
                        )}
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 w-full rounded-2xl bg-[#2596be] px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1f7ea0] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? "Adding..." : "Add Now"}
                </button>
            </form>
        </div>
    );
};

export default Add;