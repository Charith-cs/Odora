import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { registerUser } from "../../../../services/authService";
import type { UpdateLabelType } from "../../../../types/types";


const baseSchema = z.object({
    firstName: z.string().min(1).regex(/^[A-Za-z\s]+$/, "Only letters allowed"),
    lastName: z.string().min(1).regex(/^[A-Za-z\s]+$/, "Only letters allowed"),
    email: z.string().email(),
    gender: z.string().min(1),
    mobileNumber: z.string().regex(/^07[0-9]{8}$/),
    birthDay: z.string().refine((date) => new Date(date) <= new Date(), {
        message: "Invalid birth date",
    }),
    address: z.string().min(1),
    password: z.string().min(6),
});


const userSchema = baseSchema.extend({
    role: z.literal("user"),
});

const doctorSchema = baseSchema.extend({
    role: z.literal("doctor"),
    university: z.string().min(1),
    slmcReg: z.string().min(1),
    degree: z.string().min(1),
    specialization: z
        .string()
        .min(1)
        .transform((val) =>
            val.split(",").map((v) => v.trim()).filter(Boolean)
        ),
    experience: z.string().min(1),
    consultationFee: z.string().min(1),
});

const staffSchema = baseSchema.extend({
    role: z.literal("staff"),
    clinic: z.string().min(1),
});

const createSchema = (role: "user" | "doctor" | "staff") => {
    return role === "doctor" ? doctorSchema : role === "staff" ? staffSchema : userSchema;
};


type Props = {
    updateLabel: UpdateLabelType[];
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    role: "user" | "doctor" | "staff";z
};
type FormData = any;


const Add = ({ updateLabel, setShowForm, role }: Props) => {

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
            role: role,
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
            role: role,
        });
    }, [role]);

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                ...data,
                role,
            };
            const res = await registerUser(payload);
            toast.success(res.message || "User registered successfully");
            reset();
            setShowForm(false);
            console.log(payload)
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Oops! Something went wrong");
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
            }
        )}
    >
        {updateLabel.map((item) => (
            <React.Fragment key={String(item.key)}>

                <div className="flex flex-col">

                    <label className="mb-2 text-sm font-semibold text-gray-700">
                        {item.label}
                    </label>

                    <input
                        type={item.type || "text"}
                        placeholder={item.placeholder}
                        defaultValue={item?.value || ""}
                        {...register(item.key as any)}
                        className=" w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 transition-all duration-300 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10"/>

                    {errors?.[item.key] && (
                        <p className="mt-2 text-sm font-medium text-red-500">
                            {String((errors as any)[item.key]?.message)}
                        </p>
                    )}

                </div>

            </React.Fragment>
        ))}

        <button
            type="submit"
            disabled={isSubmitting}
            className=" mt-4 w-full rounded-2xl bg-[#2596be] px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1f7ea0] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? "Adding..." : "Add Now"}
        </button>

    </form>
</div>
    );
};

export default Add;