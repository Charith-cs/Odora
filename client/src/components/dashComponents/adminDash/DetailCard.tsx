import React, { useState } from "react";
import type { AdminUserCardProps } from "../../../../types/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import API from "../../../../api/axios";
import { toast } from "react-hot-toast";


/* ---------------- ZOD SCHEMA ---------------- */
const emptyToUndefined = (value: unknown) =>
    value === "" ? undefined : value;

const userSchema = z.object({
    firstName: z.preprocess(emptyToUndefined, z.string().min(2).optional()),
    lastName: z.preprocess(emptyToUndefined, z.string().min(2).optional()),
    email: z.preprocess(emptyToUndefined, z.string().email().optional()),
    mobileNumber: z.preprocess(emptyToUndefined, z.string().min(10).optional()),
    address: z.preprocess(emptyToUndefined, z.string().min(3).optional()),
    birthDay: z.preprocess(emptyToUndefined, z.string().optional()),
    gender: z.preprocess(emptyToUndefined, z.string().optional()),

    slmc: z.preprocess(emptyToUndefined, z.string().optional()),
    university: z.preprocess(emptyToUndefined, z.string().optional()),
    experience: z.preprocess(emptyToUndefined, z.string().optional()),
    consultationFee: z.preprocess(emptyToUndefined, z.string().optional()),
    specialization: z.preprocess(emptyToUndefined, z.string().optional()),
    desc: z.preprocess(emptyToUndefined, z.string().optional()),
    degree: z.preprocess(emptyToUndefined, z.string().optional()),
});

type UserFormType = z.infer<typeof userSchema>;

const DetailCard = <T extends Record<string, any>>({
    title,
    label,
    updateLabel,
    data,
    userId,
    img
}: AdminUserCardProps<T>) => {

    const [update, setUpdate] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");

    /* ---------------- RHF ---------------- */
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<UserFormType>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            firstName: data?.firstName,
            lastName: data?.lastName,
            email: data?.email,
            mobileNumber: data?.mobileNumber,
            address: data?.address,
            birthDay: data?.birthDay
                ? new Date(data.birthDay).toISOString().split("T")[0]
                : "",

            gender: data?.gender,
            university: data?.university,
            slmc: data?.slmc,
            experience: data?.experience,
            consultationFee: data?.consultationFee,
            specialization: data?.specialization?.join(", "),
            desc: data?.desc,
            degree: data?.degree
        }
    });


    const onSubmit = async (values: UserFormType) => {
        try {

            const filteredValues = Object.fromEntries(
                Object.entries(values).filter(
                    ([_, value]) => value !== "" && value !== undefined && value !== null
                )
            );

            await API.patch(
                `/management/user_update/${currentUser._id}/${userId}`,
                filteredValues
            );

            toast.success("User updated successfully");
            setUpdate(false);

        } catch (err) {
            toast.error("Update failed");
        }
    };

    React.useEffect(() => {
        if (data) {
            reset({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                mobileNumber: data.mobileNumber,
                address: data.address,

                birthDay: data?.birthDay
                    ? new Date(data.birthDay).toISOString().split("T")[0]
                    : "",

                gender: data.gender,
                university: data?.university,
                slmc: data?.slmc,
                experience: data?.experience,
                consultationFee: data?.consultationFee,
                specialization: data?.specialization?.join(", "),
                desc: data?.desc,
                degree: data?.degree
            });
        }
    }, [data, reset]);

    return (
        <>
            {update === false ? (
                /* ---------------- VIEW MODE ---------------- */
                <div className="w-full">

                    {title && (
                        <h2 className="mb-6 text-2xl font-bold text-gray-800 md:text-3xl">
                            {title}
                        </h2>
                    )}

                    <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                        <button
                            onClick={() => setUpdate(!update)}
                            className="absolute right-5 top-5 rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition-all duration-300 hover:border-[#2596be] hover:shadow-md"
                        >
                            <img src="/userDash/edit.png" alt="editimg" className="h-5 w-5 object-contain" />
                        </button>

                        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start">
                            <div className="flex justify-center lg:w-1/4">
                                <img
                                    src={img}
                                    alt="profilepic"
                                    className="h-28 w-28 rounded-full border-4 border-gray-100 object-cover shadow-md md:h-36 md:w-36"
                                />
                            </div>

                            <div className="w-full lg:flex-1">
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    {label.map((item) => (
                                        <div
                                            key={String(item.key)}
                                            className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:bg-white hover:shadow-sm"
                                        >
                                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                {item.label}
                                            </p>
                                            <p className="break-words text-base font-semibold text-gray-800">
                                                {data[item.key] || "-"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* ---------------- EDIT MODE ---------------- */
                <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                    <h1 className="mb-8 text-2xl font-bold text-gray-800 md:text-3xl">
                        Update Information
                    </h1>
                    <section className="space-y-6">

                        {updateLabel.map((item) => (
                            <React.Fragment key={String(item.key)}>

                                <div className="flex flex-col">
                                    <label className="mb-2 text-sm font-semibold text-gray-700">
                                        {item.label}
                                    </label>

                                    <input
                                        type={item.type ? item.type : "text"}
                                        placeholder={item.placeholder}
                                        {...register(item.key as keyof UserFormType)}
                                        className=" w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 transition-all duration-300 focus:border-[#2596be] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2596be]/10 " />

                                    {errors[item.key as keyof UserFormType] && (
                                        <p className="mt-2 text-sm font-medium text-red-500">
                                            {errors[item.key as keyof UserFormType]?.message as string}
                                        </p>
                                    )}

                                </div>

                            </React.Fragment>
                        ))}

                        <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={() => setUpdate(false)}
                                className=" w-full rounded-2xl border border-red-200 bg-white px-5  py-3  font-semibold text-red-600 transition-all duration-300 hover:bg-red-50 hover:border-red-300 sm:w-auto">Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className=" w-full rounded-2xl bg-[#2596be] px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1f7ea0] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ">
                                {isSubmitting ? "Updating..." : "Update Now"}
                            </button>
                        </div>
                    </section>
                </form>
            )}
        </>
    );
};

export default DetailCard;