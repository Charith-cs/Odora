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
            degree : data?.degree
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
                degree : data?.degree
            });
        }
    }, [data, reset]);

    return (
        <>
            {update === false ? (
                /* ---------------- VIEW MODE ---------------- */
                <div className=" w-full ">
                    <h2 className="text-3xl mb-6  font-semibold ">{title}</h2>

                    <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-20 w-full bg-gray-50 rounded-2xl h-full shadow-md p-4 lg:p-6 hover:shadow-xl hover:-translate-y-1 transform duration-300">

                        <img
                            src={img}
                            alt="profilepic"
                            className=" w-24 h-24 lg:w-32 lg:h-32 object-cover items-center "
                        />

                        <div className="flex flex-col ">
                            <section className="flex flex-col ">
                                <div className="grid grid-cols-2 gap-y-4 gap-x-6 items-center">
                                    {label.map((item) => (
                                        <React.Fragment key={String(item.key)}>
                                            <div className="font-semibold">{item.label}</div>
                                            <span>{data[item.key]}</span>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <img
                            src="/userDash/edit.png"
                            onClick={() => setUpdate(!update)}
                            alt="editimg"
                            className=" absolute top-4 right-4 w-6 h-6 object-contain cursor-pointer"
                        />
                    </div>
                </div>
            ) : (
                /* ---------------- EDIT MODE ---------------- */
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1"
                >
                    <h1 className="text-3xl font-semibold">Update Information</h1>

                    <section className="flex flex-col flex-1 px-10 py-10">

                        {updateLabel.map((item) => (
                            <React.Fragment key={String(item.key)}>
                                <label className="mt-2">{item.label}</label>

                                <input
                                    type={item.type ? item.type : "text"}
                                    placeholder={item.placeholder}
                                    {...register(item.key as keyof UserFormType)}
                                    className="mt-2 shadow-md rounded-xl p-2 border-none focus:border-transparent"
                                />

                                {/* Error message */}
                                {errors[item.key as keyof UserFormType] && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors[item.key as keyof UserFormType]?.message as string}
                                    </p>
                                )}
                            </React.Fragment>
                        ))}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-14 border-none bg-sky-500 shadow:md hover:bg-sky-600 hover:shadow-xl p-2 rounded-xl text-white font-semibold"
                        >
                            {isSubmitting ? "Updating..." : "Update now"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setUpdate(false)}
                            className="mt-4 text-red-600"
                        >
                            Cancel
                        </button>

                    </section>
                </form>
            )}
        </>
    );
};

export default DetailCard;