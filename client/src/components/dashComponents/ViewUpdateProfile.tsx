import { useEffect, useRef, useState } from 'react'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from 'react-hot-toast';
import { updateUser } from '../../../services/authService';
import API from '../../../api/axios';


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
    password: z.string().min(6, "Your current Password is required to update info."),
    role: z.enum(["user", "doctor"]),
});

const doctorExtraSchema = z.object({
    specialization: z.string().optional(),
    experience: z.string().optional(),
    consultationFee: z.string().optional(),
    university: z.string().optional(),
    slmcReg: z.string().optional(),
    degree: z.string().optional(),
});

type FormData = z.infer<typeof userSchema> & z.infer<typeof doctorExtraSchema>;

const ViewUpdateProfile = () => {

    const [isUpdateProfile, setIsUpdateProfile] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fullSchema = userSchema.merge(doctorExtraSchema);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting, dirtyFields }, } = useForm<FormData>({
        resolver: zodResolver(fullSchema),
        defaultValues: {
            role: "user",
        },
    });
    const [currentUser, setCurrentUser] = useState<any>(() => {
        return JSON.parse(localStorage.getItem("user") || "null");
    });


    const onSubmit = async (data: FormData) => {
        try {
            if (Object.keys(dirtyFields).length === 0) {
                toast("No changes detected");
                return;
            }
            const updatedData = {
                ...data,
                role: currentUser.role
            };

            (Object.keys(dirtyFields) as (keyof FormData)[]).forEach((field) => {
                updatedData[field] = data[field];
            });

            updatedData.role = currentUser.role;
            const res = await updateUser(currentUser._id, updatedData as any);
            localStorage.setItem("user", JSON.stringify(res.user));
            setCurrentUser(res.user);
            toast.success(res.message);
            setIsUpdateProfile(false);
        } catch (err) {
            toast.error("Oops! Something went wrong");
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select an image");
            return;
        }
        const formData = new FormData();
        formData.append("image", file);
        try {
            setLoading(true);
            const res = await API.post(`/dash/upload/${currentUser._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            const updatedUser = {
                ...currentUser,
                img: res.data.imageUrl
            };
            setCurrentUser(updatedUser)
            localStorage.setItem("user", JSON.stringify(updatedUser));
            toast.success("Profile picture uploaded successfully !");
            setPreview(null);
            setFile(null);
        } catch (err) {
            toast.error("Upload failed");
        } finally {
            setLoading(false);
        }
    }

    const handleRemove = async () => {
        try {
            const res = await API.delete(`/dash/remove/${currentUser._id}`);
            const updatedUser = { ...currentUser, img: "" };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setCurrentUser(updatedUser)
            toast.success(res.data.message);
        } catch (error: any) {
            toast.error(error.res.data.message)
        }
    }

    useEffect(() => {
        const initData = async () => {
            if (!currentUser) return;

            let data = { ...currentUser };

            if (currentUser.role === "doctor") {
                try {
                    const res = await API.get(`/doctor/update/${currentUser._id}`);
                    data = { ...data, ...res.data };
                } catch {
                    toast.error("Failed to load doctor data");
                }
            }

            reset(data);
        };

        initData();
    }, [currentUser, reset]);

    return (
        <>
            {isUpdateProfile === false ?
                <div className=" mt-6 grid grid-cols-1 md:grid-cols-[2fr_4fr] ">
                    <div className=" flex flex-col items-center  ">
                        <div className="relative">
                            <img
                                src={preview ? preview : currentUser?.img
                                    ? currentUser.img
                                    : "./userDash/user.png"
                                }
                                alt="profilepic"
                                className="w-48 h-48 object-cover mt-10 cursor-pointer rounded-full"
                                onClick={() => fileInputRef.current?.click()}
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={(e) => {
                                    const selectedFile = e.target.files?.[0] || null;
                                    setFile(selectedFile);

                                    if (selectedFile) {
                                        const previewUrl = URL.createObjectURL(selectedFile);
                                        setPreview(previewUrl);
                                    }
                                }}
                                className="hidden"
                            />
                        </div>
                        <span className=" w-4/5 gap-8 flex items-center justify-center mt-10">
                            <button
                                onClick={handleUpload} disabled={loading}
                                className=" w-1/3 border border-gray-500 shadow-md hover:text-sky-500 hover:border-sky-600 hover:shadow-xl p-2 rounded-xl text-gray-500 font-semibold" >
                                {loading ? "Uploading..." : "Upload"}
                            </button>
                            <button onClick={handleRemove} className=" w-1/3 border border-gray-500 shadow-md hover:text-red-500 hover:border-red-600 hover:shadow-xl p-2 rounded-xl text-gray-500 font-semibold" >Remove</button>
                        </span>
                    </div>
                    <div className="flex flex-col ">
                        <section className="flex flex-col px-16 py-16 gap-6 max-w-xl mx-auto w-full group bg-white rounded-2xl h-full shadow-md p-6  items-center justify-center
                            hover:shadow-xl hover:-translate-y-1 transition duration-300">

                            <h2 className="text-3xl mb-6 text-center">
                                Your Information 😇
                            </h2>

                            <div className="grid grid-cols-2 gap-y-4 gap-x-6 items-center">
                                <div className="font-semibold">Full name :</div>
                                <span>{currentUser?.firstName + " " + currentUser?.lastName}</span>

                                <div className="font-semibold">Email :</div>
                                <span>{currentUser?.email}</span>

                                <div className="font-semibold">Mobile number :</div>
                                <span>{currentUser?.mobileNumber}</span>

                                <div className="font-semibold">Address :</div>
                                <span>{currentUser?.address}</span>
                            </div>

                            <button
                                className="mt-10 w-1/2 bg-sky-500 shadow-md hover:bg-sky-600 hover:shadow-xl p-2 rounded-xl text-white font-semibold transition"
                                onClick={() => { setIsUpdateProfile(!isUpdateProfile) }}>
                                Update Profile
                            </button>

                        </section>
                    </div>
                </div>
                :
                <div className=" mt-6 grid grid-cols-1 ">
                    {/* First Name */}
                    <label className="mt-2">First name</label>
                    <input
                        {...register("firstName")}
                        type="text"
                        placeholder={currentUser.firstName}
                        className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.firstName ? "border border-red-500" : ""
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
                        placeholder={currentUser.lastName}
                        className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.lastName ? "border border-red-500" : ""
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
                        placeholder={currentUser.email}
                        className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.email ? "border border-red-500" : ""
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
                        placeholder={currentUser.mobileNumber}
                        className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.mobileNumber ? "border border-red-500" : ""
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
                        type="text"
                        placeholder={currentUser.birthDay}
                        className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.birthDay ? "border border-red-500" : ""
                            }`}
                    />
                    {errors.birthDay && (
                        <p className="text-red-500 text-sm">{errors.birthDay.message}</p>
                    )}

                    {/* Gender */}
                    <label className="mt-2">Gender</label>
                    <div
                        className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.gender ? "border border-red-500" : ""
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
                        placeholder={currentUser.address}
                        className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.address ? "border border-red-500" : ""
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
                        placeholder="Enter your current password"
                        className={`mt-2 shadow-md rounded-xl p-2 outline-none ${errors.password ? "border border-red-500" : ""
                            }`}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}

                    {currentUser?.role === "doctor" && (
                        <>
                            <label className="mt-2">Specialization</label>
                            <input
                                {...register("specialization")}
                                type="text"
                                placeholder="Enter specialization"
                                className="mt-2 shadow-md rounded-xl p-2 outline-none"
                            />

                            <label className="mt-2">Experience (Years)</label>
                            <input
                                {...register("experience")}
                                type="text"
                                placeholder="Enter experience"
                                className="mt-2 shadow-md rounded-xl p-2 outline-none"
                            />

                            <label className="mt-2">Consultation Fee</label>
                            <input
                                {...register("consultationFee")}
                                type="text"
                                placeholder="Enter fee"
                                className="mt-2 shadow-md rounded-xl p-2 outline-none"
                            />

                            <label className="mt-2">University</label>
                            <input
                                {...register("university")}
                                type="text"
                                placeholder="Enter university"
                                className="mt-2 shadow-md rounded-xl p-2 outline-none"
                            />

                            <label className="mt-2">SLMC Registration</label>
                            <input
                                {...register("slmcReg")}
                                type="text"
                                placeholder="Enter SLMC reg"
                                className="mt-2 shadow-md rounded-xl p-2 outline-none"
                            />

                            <label className="mt-2">Degree</label>
                            <input
                                {...register("degree")}
                                type="text"
                                placeholder="Enter degree"
                                className="mt-2 shadow-md rounded-xl p-2 outline-none"
                            />
                        </>
                    )}

                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="mt-14 mb-8 bg-sky-500 hover:bg-sky-600 p-2 rounded-xl text-white font-semibold"
                    >
                        {isSubmitting ? "Updating..." : "Update"}
                    </button>
                </div>
            }
        </>
    )
}

export default ViewUpdateProfile