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
    desc: z.string().optional(),
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);


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
        } catch (err: any) {
            toast.error(err?.response?.message || "Upload failed");
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

    const handleDelete = async () => {
        try {
            await API.delete(`/auth/delete/${currentUser._id}`)
            toast.success("Your Odora account has been deleted!");
        } catch (err: any) {
            toast.error(err?.message || "Oops! Something went wrong");
        }
    }

    return (
        <>
            {isUpdateProfile === false ?
                <div className="mt-8 grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-8">

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-8 flex flex-col items-center">

                        <div className="relative group">

                            <img
                                src={preview ? preview : currentUser?.img ? currentUser.img : "./userDash/user.png"}
                                alt="profilepic"
                                className="w-52 h-52 rounded-full object-cover border-4 border-[#2596be]/15 shadow-lg cursor-pointer transition duration-300 group-hover:scale-[1.02]"
                                onClick={() => fileInputRef.current?.click()}
                            />

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-[#2596be] text-white shadow-lg hover:bg-[#1f84a8] transition flex items-center justify-center"
                            >
                                ✎
                            </button>

                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/jpeg,image/png"
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

                        <h3 className="mt-6 text-2xl font-bold text-gray-800 text-center">
                            {currentUser?.firstName} {currentUser?.lastName}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            {currentUser?.role === "doctor" ? "Doctor Account" : currentUser?.role === "admin" ? "Management Account" : "Patient Account"}
                        </p>

                        <div className="w-full flex gap-3 mt-8">

                            <button
                                onClick={handleUpload}
                                disabled={loading}
                                className="flex-1 rounded-2xl bg-[#2596be] text-white font-semibold py-3 shadow-md hover:bg-[#1f84a8] hover:shadow-lg disabled:opacity-60 transition-all duration-300"
                            >
                                {loading ? "Uploading..." : "Upload"}
                            </button>

                            <button
                                onClick={handleRemove}
                                className="flex-1 rounded-2xl border border-red-300 text-red-500 font-semibold py-3 hover:bg-red-50 transition-all duration-300"
                            >
                                Remove
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-[#2596be]">Your Information</h2>
                                <p className="text-gray-500 mt-2"> Review your personal account information.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {currentUser?.firstName + " " + currentUser?.lastName}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="mt-1 font-semibold text-gray-800 break-all">
                                    {currentUser?.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Mobile Number</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {currentUser?.mobileNumber}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {currentUser?.address}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-10 gap-5">
                            <button
                                className={`px-8 py-3 rounded-2xl ${currentUser.role === "admin" ? " cursor-not-allowed bg-gray-200 border border-gray-700 hover:border-red-700 hover:text-red-500" : "bg-[#2596be] text-white font-semibold shadow-md hover:bg-[#1f84a8] hover:shadow-xl transition-all duration-300"}`}
                                onClick={() => { currentUser.role === "admin" ? toast("Contact your System Admin to Update your Profile", { icon: "⚠️" }) : setIsUpdateProfile(!isUpdateProfile); }}
                            >
                                Update Profile
                            </button>
                            <button
                                className={`px-8 py-3 rounded-2xl ${currentUser.role === "admin" ? " cursor-not-allowed bg-gray-200 border border-gray-700 hover:border-red-700 hover:text-red-500" : "bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 hover:shadow-xl transition-all duration-300"}`}
                                onClick={() => { currentUser.role === "admin" ? toast("Contact your System Admin to Delete your Profile", { icon: "⚠️" }) : setShowDeleteModal(true) }}
                            >
                                Delete Profile
                            </button>

                        </div>
                    </div>
                    {showDeleteModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                            <div className="w-[420px] rounded-2xl bg-white p-6 shadow-2xl">

                                <div className="flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                        <span className="text-3xl">🗑️</span>
                                    </div>
                                </div>

                                <h2 className="mt-5 text-center text-xl font-bold text-gray-800"> Delete Account</h2>
                                <p className="mt-3 text-center text-gray-500">Are you sure you want to delete your Odora account?</p>
                                <p className="mt-2 text-center text-sm text-red-500"> This action cannot be undone.</p>

                                <div className="mt-8 flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);

                                        }}
                                        className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-600 transition hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>
                        </div>
                    )}
                </div>
                :
                <div className="mt-8 max-w-6xl mx-auto">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-8 md:p-10">

                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-[#2596be]">
                                Update Your Profile
                            </h2>
                            <p className="mt-2 text-gray-500">
                                Keep your personal information accurate and up to date.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* First Name */}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    First Name
                                </label>

                                <input
                                    {...register("firstName")}
                                    type="text"
                                    placeholder={currentUser.firstName}
                                    className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors.firstName ? "border-red-500" : "border-gray-200"}`}
                                />

                                {errors.firstName && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>

                            {/* Last Name */}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Last Name
                                </label>

                                <input
                                    {...register("lastName")}
                                    type="text"
                                    placeholder={currentUser.lastName}
                                    className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors.lastName ? "border-red-500" : "border-gray-200"}`}
                                />

                                {errors.lastName && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>

                            {/* Email */}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>

                                <input
                                    {...register("email")}
                                    type="text"
                                    placeholder={currentUser.email}
                                    className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors.email ? "border-red-500" : "border-gray-200"}`}
                                />

                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Mobile */}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mobile Number
                                </label>

                                <input
                                    {...register("mobileNumber")}
                                    type="text"
                                    placeholder={currentUser.mobileNumber}
                                    className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors.mobileNumber ? "border-red-500" : "border-gray-200"}`}
                                />

                                {errors.mobileNumber && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.mobileNumber.message}
                                    </p>
                                )}
                            </div>

                            {/* Birthday */}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Birth Date
                                </label>

                                <input
                                    {...register("birthDay")}
                                    type="text"
                                    placeholder={currentUser.birthDay}
                                    className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors.birthDay ? "border-red-500" : "border-gray-200"}`}
                                />

                                {errors.birthDay && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.birthDay.message}
                                    </p>
                                )}
                            </div>

                            {/* Gender */}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Gender
                                </label>

                                <select
                                    {...register("gender")}
                                    className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors.gender ? "border-red-500" : "border-gray-200"}`}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>

                                {errors.gender && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.gender.message}
                                    </p>
                                )}
                            </div>

                            {/* Address */}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Address
                                </label>

                                <input
                                    {...register("address")}
                                    type="text"
                                    placeholder={currentUser.address}
                                    className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors.address ? "border-red-500" : "border-gray-200"}`}
                                />

                                {errors.address && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.address.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Current Password
                                </label>

                                <input
                                    {...register("password")}
                                    type="password"
                                    placeholder="Enter your current password"
                                    className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors.password ? "border-red-500" : "border-gray-200"}`}
                                />

                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {currentUser?.role === "doctor" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Specialization
                                        </label>

                                        <input
                                            {...register("specialization")}
                                            type="text"
                                            placeholder="Enter specialization"
                                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Experience (Years)
                                        </label>

                                        <input
                                            {...register("experience")}
                                            type="text"
                                            placeholder="Enter experience"
                                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Consultation Fee
                                        </label>

                                        <input
                                            {...register("consultationFee")}
                                            type="text"
                                            placeholder="Enter fee"
                                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            University
                                        </label>

                                        <input
                                            {...register("university")}
                                            type="text"
                                            placeholder="Enter university"
                                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            SLMC Registration
                                        </label>

                                        <input
                                            {...register("slmcReg")}
                                            type="text"
                                            placeholder="Enter SLMC registration"
                                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Degree
                                        </label>

                                        <input
                                            {...register("degree")}
                                            type="text"
                                            placeholder="Enter degree"
                                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Description
                                        </label>

                                        <input
                                            {...register("desc")}
                                            type="text"
                                            placeholder="Enter your description"
                                            className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 ${errors.desc ? "border-red-500" : "border-gray-200"}`}
                                        />

                                        {errors.desc && (
                                            <p className="mt-2 text-sm text-red-500">
                                                {errors.desc.message}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-10">

                            <button
                                type="button"
                                onClick={() => setIsUpdateProfile(false)}
                                className="px-8 py-3 rounded-2xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition-all duration-300"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                                className="px-8 py-3 rounded-2xl bg-[#2596be] hover:bg-[#1f84a8] text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                {isSubmitting ? "Updating..." : "Update Profile"}
                            </button>

                        </div>

                    </div>
                </div>
            }
        </>
    )
}

export default ViewUpdateProfile